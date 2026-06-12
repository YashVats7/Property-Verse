import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./lib/auth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import OpportunityDetailPage from "./pages/OpportunityDetailPage";
import LeveragePage from "./pages/LeveragePage";
import AboutPage from "./pages/AboutPage";
import PartnersPage from "./pages/PartnersPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading || user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#0A2540] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function Shell({ children }) {
  return (
    <div className="App">
      <Navbar />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<Shell><HomePage /></Shell>} />
          <Route path="/opportunities" element={<Shell><OpportunitiesPage /></Shell>} />
          <Route path="/opportunities/:id" element={<Shell><OpportunityDetailPage /></Shell>} />
          <Route path="/leverage" element={<Shell><LeveragePage /></Shell>} />
          <Route path="/about" element={<Shell><AboutPage /></Shell>} />
          <Route path="/partners" element={<Shell><PartnersPage /></Shell>} />
          <Route path="/contact" element={<Shell><ContactPage /></Shell>} />
          <Route path="/login" element={<Shell><LoginPage /></Shell>} />
          <Route path="/signup" element={<Shell><SignupPage /></Shell>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Shell><DashboardPage /></Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Shell><AdminPage /></Shell>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
