import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import Dashboard from './components/Layout/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Extra check for user data
  if (!user) {
    return <LoadingSpinner />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard>
            <DashboardHome />
          </Dashboard>
        </ProtectedRoute>
      } />

      {/* Hotel Routes */}
      <Route path="/hotel/*" element={
        <ProtectedRoute>
          <Dashboard>
            <div className="card">
              <div className="card-body">
                <h2 className="text-2xl font-bold mb-4">Hotel Management</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Hotel booking and room management system coming soon...
                </p>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300">Features:</h3>
                  <ul className="mt-2 text-sm text-blue-800 dark:text-blue-400 space-y-1">
                    <li>• 24/7 Booking System</li>
                    <li>• Room Types: Double ($40), Executive ($60), Master ($120)</li>
                    <li>• Guest Management & Check-in/out</li>
                    <li>• Room Status Tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </Dashboard>
        </ProtectedRoute>
      } />

      {/* Restaurant Routes */}
      <Route path="/restaurant/*" element={
        <ProtectedRoute>
          <Dashboard>
            <div className="card">
              <div className="card-body">
                <h2 className="text-2xl font-bold mb-4">Restaurant Management</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Restaurant POS and order management system coming soon...
                </p>
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-300">Features:</h3>
                  <ul className="mt-2 text-sm text-orange-800 dark:text-orange-400 space-y-1">
                    <li>• Modern POS System</li>
                    <li>• Local & Continental Menu (GHS)</li>
                    <li>• Order Management (Dine-in, Takeaway, Room Service)</li>
                    <li>• Kitchen Display Integration</li>
                  </ul>
                </div>
              </div>
            </div>
          </Dashboard>
        </ProtectedRoute>
      } />

      {/* Pub Routes */}
      <Route path="/pub/*" element={
        <ProtectedRoute>
          <Dashboard>
            <div className="card">
              <div className="card-body">
                <h2 className="text-2xl font-bold mb-4">Pub Services</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Pub inventory and sales management system coming soon...
                </p>
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-300">Features:</h3>
                  <ul className="mt-2 text-sm text-purple-800 dark:text-purple-400 space-y-1">
                    <li>• Drink Menu Management (GHS)</li>
                    <li>• Stock Level Tracking</li>
                    <li>• Local & Continental Beverages</li>
                    <li>• Sales Analytics</li>
                  </ul>
                </div>
              </div>
            </div>
          </Dashboard>
        </ProtectedRoute>
      } />

      {/* Accounting Routes */}
      <Route path="/accounting/*" element={
        <ProtectedRoute>
          <Dashboard>
            <div className="card">
              <div className="card-body">
                <h2 className="text-2xl font-bold mb-4">Accounting System</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Financial management and accounting system coming soon...
                </p>
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <h3 className="font-semibold text-green-900 dark:text-green-300">Features:</h3>
                  <ul className="mt-2 text-sm text-green-800 dark:text-green-400 space-y-1">
                    <li>• Multi-Currency Support (USD/GHS)</li>
                    <li>• Transaction Management</li>
                    <li>• Financial Reporting</li>
                    <li>• Audit Trail & Controls</li>
                  </ul>
                </div>
              </div>
            </div>
          </Dashboard>
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <div className="App">
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--color-background)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-primary)',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--color-primary)',
                    secondary: 'white',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: 'white',
                  },
                },
              }}
            />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;