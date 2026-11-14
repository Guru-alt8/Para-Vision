import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 flex flex-col"
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col selection:bg-accent/30">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
