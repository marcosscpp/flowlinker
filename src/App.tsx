import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import {
  Home,
  Login,
  Stats,
  Billing,
  Profiles,
  AI,
  Devices,
} from "@/pages";
import { AuthProvider } from "@/context";
import { SidebarView, PrivateRoute, PublicRoute } from "@/components";

const PrivateLayout = () => {
  return (
    <PrivateRoute>
      <SidebarView>
        <Outlet />
      </SidebarView>
    </PrivateRoute>
  );
};

function App() {
  return (
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

          <Route element={<PrivateLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/estatisticas" element={<Stats />} />
            <Route path="/pagamentos" element={<Billing />} />
            <Route path="/personas" element={<Profiles />} />
            <Route path="/inteligencia-artificial" element={<AI />} />
            <Route path="/dispositivos" element={<Devices />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
