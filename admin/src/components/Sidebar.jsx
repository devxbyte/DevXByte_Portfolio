import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiHome, HiStar, HiUser, HiBriefcase, HiCode, HiAcademicCap,
  HiCollection, HiShieldCheck, HiMail, HiCog, HiLogout
} from 'react-icons/hi';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { path: '/', icon: <HiHome />, label: 'Dashboard' },
  ];

  const contentLinks = [
    { path: '/hero', icon: <HiStar />, label: 'Hero Section' },
    { path: '/about', icon: <HiUser />, label: 'About' },
    { path: '/experience', icon: <HiBriefcase />, label: 'Experience' },
    { path: '/projects', icon: <HiCode />, label: 'Projects' },
    { path: '/skills', icon: <HiCollection />, label: 'Skills' },
    { path: '/education', icon: <HiAcademicCap />, label: 'Education' },
    { path: '/certifications', icon: <HiShieldCheck />, label: 'Certifications' },
  ];

  const systemLinks = [
    { path: '/messages', icon: <HiMail />, label: 'Messages' },
    { path: '/settings', icon: <HiCog />, label: 'Settings' },
  ];

  const renderLinks = (items) =>
    items.map(link => (
      <NavLink
        key={link.path}
        to={link.path}
        end={link.path === '/'}
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        {link.icon}
        {link.label}
      </NavLink>
    ));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>D</span>.K Admin
      </div>

      <nav className="sidebar-nav">
        {renderLinks(links)}
        <div className="sidebar-label">Content</div>
        {renderLinks(contentLinks)}
        <div className="sidebar-label">System</div>
        {renderLinks(systemLinks)}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <HiLogout /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
