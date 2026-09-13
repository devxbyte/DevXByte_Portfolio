import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2 className="cta-title">Let's work<br />together</h2>

        <div className="cta-btn-wrapper">
          <Link to="/contact">
            <button className="cta-btn">Get in touch</button>
          </Link>
        </div>

        <div className="cta-contact-info">
          <a href="mailto:devusaini159@gmail.com" className="cta-contact-link">
            devusaini159@gmail.com
          </a>
          <a href="tel:+917878586274" className="cta-contact-link">
            +91 78 78 58 62 74
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
