import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageHero from './pages/ManageHero';
import ManageAbout from './pages/ManageAbout';
import ManageProjects from './pages/ManageProjects';
import ManageSkills from './pages/ManageSkills';
import ManageExperience from './pages/ManageExperience';
import ManageEducation from './pages/ManageEducation';
import ManageCertifications from './pages/ManageCertifications';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import './styles/admin.css';

const ProtectedLayout = () => {
  const { token, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hero" element={<ManageHero />} />
            <Route path="/about" element={<ManageAbout />} />
            <Route path="/projects" element={<ManageProjects />} />
            <Route path="/skills" element={<ManageSkills />} />
            <Route path="/experience" element={<ManageExperience />} />
            <Route path="/education" element={<ManageEducation />} />
            <Route path="/certifications" element={<ManageCertifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#141428',
            color: '#f0f0f5',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px'
          }
        }}
      />
    </AuthProvider>
  );
}

export default App;
