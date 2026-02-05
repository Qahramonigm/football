import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { BookingsProvider } from '@/contexts/BookingsContext';
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Toaster } from "sonner";
import Header from "@/components/Header";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import VerifyCodePage from "@/pages/auth/VerifyCodePage";
import RegisterPage from "@/pages/auth/RegisterPage";

// User Pages
import HomePage from "@/pages/user/HomePage";
import FieldDetailPage from "@/pages/user/FieldDetailPage";
import UserBookingsPage from "@/pages/user/UserBookingsPage";
import UserProfilePage from "@/pages/user/UserProfilePage";

// Owner Pages
import OwnerDashboard from "@/pages/owner/OwnerDashboard";
import AddFieldPage from "@/pages/owner/AddFieldPage";
import EditFieldPage from "@/pages/owner/EditFieldPage";
import VerifyBookingPage from "@/pages/owner/VerifyBookingPage";
import PromoteFieldPage from "@/pages/owner/PromoteFieldPage";
import OwnerFieldsPage from "@/pages/owner/OwnerFieldsPage";
import OwnerBookingsPage from "@/pages/owner/OwnerBookingsPage";

// Protected Route Component
const ProtectedRoute = ({ children, requireOwner = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireOwner && user?.userType !== 'owner') {
    return <Navigate to="/" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/fields" element={<HomePage />} />
          <Route path="/fields/:id" element={<FieldDetailPage />} />
          
          {/* Protected User Routes */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <UserBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Owner Routes */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute requireOwner={true}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/add-field"
            element={
              <ProtectedRoute requireOwner={true}>
                <AddFieldPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/edit-field/:fieldId"
            element={
              <ProtectedRoute requireOwner={true}>
                <EditFieldPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/fields"
            element={
              <ProtectedRoute requireOwner={true}>
                <OwnerFieldsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/bookings"
            element={
              <ProtectedRoute requireOwner={true}>
                <OwnerBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/verify-booking"
            element={
              <ProtectedRoute requireOwner={true}>
                <VerifyBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/promote"
            element={
              <ProtectedRoute requireOwner={true}>
                <PromoteFieldPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/promote/:fieldId"
            element={
              <ProtectedRoute requireOwner={true}>
                <PromoteFieldPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <LanguageProvider>
        <AuthProvider>
          <BookingsProvider>
            <AppRoutes />
          </BookingsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
