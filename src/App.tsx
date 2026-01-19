import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { Home, Login, Stats, Settings, Profiles, AI, Devices, Campaigns, Help, ForgotPassword, ResetPassword } from "@/pages";
import { AuthProvider, TourProvider, ToastProvider } from "@/context";
import { SidebarView, PrivateRoute, PublicRoute } from "@/components";
import { TourProvider as TourJoyride } from "@/components/Tour";

const PrivateLayout = () => {
  return (
    <PrivateRoute>
      <TourProvider>
        <SidebarView>
          <Outlet />
        </SidebarView>
        <TourJoyride />
      </TourProvider>
    </PrivateRoute>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Rota pública */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/esqueci-senha"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/redefinir-senha"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          <Route element={<PrivateLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/estatisticas" element={<Stats />} />
            <Route path="/pagamentos" element={<Settings />} />
            <Route path="/perfis" element={<Profiles />} />
            <Route path="/inteligencia-artificial" element={<AI />} />
            <Route path="/dispositivos" element={<Devices />} />
            <Route path="/campanhas" element={<Campaigns />} />
            <Route path="/ajuda" element={<Help />} />
          </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
