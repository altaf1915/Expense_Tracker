import { lazy, Suspense, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SideBar from "./components/SideBar";
import { AppContext } from "./context/AppContext";

const DashBoard = lazy(() => import("./pages/DashBoard"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Income = lazy(() => import("./pages/Income"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ViewTransactions = lazy(() => import("./pages/ViewTransactions"));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => {
  const { user, logout } = useContext(AppContext);
  return (
    <div className="app-shell">
      <SideBar user={user} onLogout={logout} />
      <main className="workspace">{children}</main>
    </div>
  );
};

const App = () => (
  <>
    <Suspense fallback={<div className="screen-loader">Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><AppLayout><DashBoard /></AppLayout></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><AppLayout><ViewTransactions /></AppLayout></ProtectedRoute>} />
        <Route path="/income" element={<ProtectedRoute><AppLayout><Income /></AppLayout></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><AppLayout><Expenses /></AppLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
    <ToastContainer position="top-right" autoClose={2500} />
  </>
);

export default App;
