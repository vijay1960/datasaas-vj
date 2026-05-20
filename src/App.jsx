import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Calendar from './pages/Calendar';
import Account from './pages/Account';
import Admin from './pages/Admin';
import { useTheme } from './hooks/useTheme';

function AppLayout({ children, theme, toggleTheme }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleNewTask = () => {
    setCommandOpen(false);
    setTaskModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar theme={theme} toggleTheme={toggleTheme} onOpenCommandPalette={() => setCommandOpen(true)} />
      <div className="flex">
        <Sidebar onNewTask={handleNewTask} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme}><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme}><Tasks /></AppLayout></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme}><Projects /></AppLayout></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme}><Calendar /></AppLayout></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme}><Account /></AppLayout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AppLayout theme={theme} toggleTheme={toggleTheme}><Admin /></AppLayout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
