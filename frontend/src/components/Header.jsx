import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home' },
    { path: '/work', label: 'Work' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="header">
        <Link to="/" className="header-logo">
          <span>DevX</span>byte
        </Link>

        <div className="header-right">
          <button className="theme-btn" onClick={toggleTheme} id="theme-toggle">
            {theme === 'dark' ? <HiSun /> : <HiMoon />}
          </button>

          <button
            className={`menu-btn ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            id="menu-toggle"
          >
            <div className="menu-dot">
              <span></span>
              <span></span>
            </div>
            Menu
          </button>
        </div>
      </header>

      {/* Fullscreen Navigation */}
      <div className={`nav-overlay ${menuOpen ? 'open' : ''}`}>
        <div className="nav-bg" onClick={() => setMenuOpen(false)}></div>
        <div className="nav-panel">
          <div className="nav-label">Navigation</div>
          <div className="nav-links">
            {links.map(link => (
              <div key={link.path} className="nav-link-item">
                <Link
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  style={location.pathname === link.path ? { color: '#fff' } : {}}
                >
                  <span className="nav-dot"></span>
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          <div className="nav-socials">
            <a href="https://github.com/devxbyte" target="_blank" rel="noopener noreferrer" className="nav-social">Github</a>
            <a href="https://www.linkedin.com/in/devxbyte" target="_blank" rel="noopener noreferrer" className="nav-social">LinkedIn</a>
            <a href="https://www.instagram.com/dev.__saini" target="_blank" rel="noopener noreferrer" className="nav-social">Instagram</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
