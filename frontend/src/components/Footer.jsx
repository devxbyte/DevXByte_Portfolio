import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <span>© 2026 Devxbyte</span>
      </div>
      <div className="footer-socials">
        <a href="https://github.com/devxbyte" target="_blank" rel="noopener noreferrer" className="footer-social">Github</a>
        <a href="https://www.linkedin.com/in/devxbyte/?skipRedirect=true" target="_blank" rel="noopener noreferrer" className="footer-social">LinkedIn</a>
        <a href="https://www.instagram.com/dev.__saini?stkn=MTBuNGJ6YTY3N3hkYw==" target="_blank" rel="noopener noreferrer" className="footer-social">Instagram</a>
      </div>
    </footer>
  );
};

export default Footer;
