import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import { authService } from "@/services";
import type { AuthUser, LoginPayload } from "@/services/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type State = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: "INITIALIZE_SUCCESS"; payload: AuthUser }
  | { type: "INITIALIZE_FAILURE" }
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS" }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT_START" }
  | { type: "LOGOUT_SUCCESS" };

const INITIAL_STATE: State = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "INITIALIZE_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "INITIALIZE_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT_START":
      return {
        ...state,
        isLoading: true,
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const bootstrapSession = async () => {
      try {
        const profile = await authService.me<AuthUser>();

        if (!signal.aborted) {
          dispatch({ type: "INITIALIZE_SUCCESS", payload: profile });
        }
      } catch (err) {
        if (!signal.aborted) {
          dispatch({ type: "INITIALIZE_FAILURE" });
        }
      }
    };

    bootstrapSession();

    return () => {
      abortController.abort();
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    dispatch({ type: "LOGIN_START" });
    try {
      await authService.login(payload);
      dispatch({ type: "LOGIN_SUCCESS" });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível fazer login";
      dispatch({ type: "LOGIN_FAILURE", payload: message });
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    dispatch({ type: "LOGOUT_START" });
    try {
      await authService.logout();
    } catch {
      // Erro de logout ignorado - usuário será deslogado localmente de qualquer forma
    } finally {
      dispatch({ type: "LOGOUT_SUCCESS" });
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
