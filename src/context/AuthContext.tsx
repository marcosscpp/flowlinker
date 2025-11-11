import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer, // Importado
  useCallback, // Importado
  type ReactNode,
} from "react";
import { authService } from "@/services";
import type { AuthUser, LoginPayload, LoginResponse } from "@/services/auth";

// As types de serviço permanecem as mesmas
// ...

// A interface do contexto é simplificada, pois 'setSession' é agora
// uma lógica interna do reducer e não precisa ser exposta.
interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// --- Lógica do Reducer ---

// 1. Definir o tipo do estado
type State = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

// 2. Definir os tipos de ações possíveis
type Action =
  | { type: "INITIALIZE_SUCCESS"; payload: AuthUser }
  | { type: "INITIALIZE_FAILURE" }
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: AuthUser }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT_START" }
  | { type: "LOGOUT_SUCCESS" };

// 3. Definir o estado inicial
const INITIAL_STATE: State = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Começa como true para verificar a sessão
  error: null,
};

// 4. Criar a função reducer
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
        user: action.payload,
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
        error: null, // Limpa erros ao deslogar
      };
    default:
      return state;
  }
};

// --- Componente Provider ---

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Substituímos os múltiplos 'useState' por um 'useReducer'
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

  // Efeito para verificar a sessão no carregamento
  useEffect(() => {
    // Usamos AbortController para lidar com a limpeza
    const abortController = new AbortController();
    const { signal } = abortController;

    const bootstrapSession = async () => {
      try {
        // Supondo que authService.me pode aceitar um AbortSignal
        // Se não, o `if (!signal.aborted)` abaixo ainda funciona
        const profile = await authService.me<AuthUser>(/* { signal } */);

        // Só atualiza o estado se o componente não foi desmontado
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

    // Função de limpeza que aborta a requisição/atualização
    return () => {
      abortController.abort();
    };
  }, []); // Executa apenas na montagem

  // As ações agora são memoizadas com useCallback
  // Elas disparam ações para o reducer em vez de usar 'setState'
  const login = useCallback(async (payload: LoginPayload) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authService.login<LoginResponse | void>(payload);

      let userData: AuthUser | null = null;

      if (response && typeof response === "object" && "user" in response) {
        userData = (response as LoginResponse).user ?? null;
      }

      if (!userData) {
        userData = await authService.me<AuthUser>();
        
      }

      if (!userData) {
        throw new Error("Não foi possível recuperar os dados do usuário.");
      }

      dispatch({ type: "LOGIN_SUCCESS", payload: userData });
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
    } catch (err) {
      // Mesmo se o logout da API falhar, forçamos o logout no cliente.
      console.error("Falha na chamada da API de logout:", err);
    } finally {
      // Sempre despacha SUCESSO para limpar o estado do cliente
      dispatch({ type: "LOGOUT_SUCCESS" });
    }
  }, []);

  // O valor do contexto é criado combinando o estado do reducer
  // com as ações memoizadas
  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
    }),
    [state, login, logout] // Depende do objeto de estado e das funções
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// O hook 'useAuth' permanece exatamente o mesmo
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
