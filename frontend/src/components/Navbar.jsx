import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { gsap } from '../hooks/useGsap';
import { HiSun, HiMoon } from 'react-icons/hi';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const lastScroll = useRef(0);
  const navRef = useRef(null);

  const links = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setHidden(current > 100 && current > lastScroll.current);
      lastScroll.current = current;

      // Active section detection
      const sections = links.map(l => document.getElementById(l.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop - 200 <= current) {
          setActiveSection(links[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <nav className={`navbar ${hidden ? 'hidden' : ''}`} ref={navRef} id="navbar">
      <div className="container">
        <div className="nav-logo">
          <span>D</span>.K
        </div>

        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {links.map(link => (
            <li key={link.id}>
              <a
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} id="theme-toggle">
            {theme === 'dark' ? <HiSun /> : <HiMoon />}
          </button>
          <button
            className={`mobile-toggle ${mobileOpen ? 'active' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            id="mobile-menu-toggle"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
