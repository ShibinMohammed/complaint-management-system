import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import ComplaintForm from './pages/ComplaintForm';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Import icons
import { FaHome, FaUserShield, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';

function AuthStatus() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="auth-status">
      {user ? (
        <>
          <span>Welcome, <span className="username">{user.username}</span>!</span>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </>
      ) : (
        <>
          <span>You are not logged in.</span>
          <Link to="/login"><FaSignInAlt /> Login</Link>
          <span>or</span>
          <Link to="/register"><FaUserPlus /> Register</Link>
        </>
      )}
      <button onClick={toggleTheme} className="theme-toggle-button">
        {theme === 'dark' ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
}

function NavLinks() {
  const { user } = useAuth();

  return (
    <ul>
      {(!user || !user.isAdmin) && ( // Show Submit Complaint if NOT logged in OR if logged in but NOT admin
        <li>
          <Link to="/">
            <FaHome /> Submit Complaint
          </Link>
        </li>
      )}
      {user && user.isAdmin && ( // Only show Admin Dashboard if logged in AND is admin
        <li>
          <Link to="/admin">
            <FaUserShield /> Admin Dashboard
          </Link>
        </li>
      )}
    </ul>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="app-container">
            <nav className="navbar">
              <NavLinks /> {/* Render NavLinks component here */}
              <AuthStatus />
            </nav>
            <main className="container">
              <Routes>
                <Route
                  path="/"
                  element={
                    <PublicRoute>
                      <ComplaintForm />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <RegisterPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;