import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { submitContact } from '../utils/api';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    gsap.fromTo('.contact-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    gsap.fromTo('.contact-form', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' });
    gsap.fromTo('.contact-sidebar', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power3.out' });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await submitContact(form);
      toast.success('Message sent! I\'ll get back to you soon ✨');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Failed to send. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <section className="contact-page">
        <h1 className="contact-title">
          Let's start a<br />project together
        </h1>

        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit} id="contact-form">
            <div className="form-field">
              <label>01 — What's your name?</label>
              <input type="text" name="name" placeholder="Devendra Saini *" value={form.name} onChange={handleChange} id="contact-name" />
            </div>
            <div className="form-field">
              <label>02 — What's your email?</label>
              <input type="email" name="email" placeholder="devendra@example.com *" value={form.email} onChange={handleChange} id="contact-email" />
            </div>
            <div className="form-field">
              <label>03 — What's the subject?</label>
              <input type="text" name="subject" placeholder="Project collaboration" value={form.subject} onChange={handleChange} id="contact-subject" />
            </div>
            <div className="form-field">
              <label>04 — Your message</label>
              <textarea name="message" placeholder="Tell me about your project *" value={form.message} onChange={handleChange} id="contact-message" rows={4}></textarea>
            </div>

            <div className="form-submit">
              <button type="submit" className="submit-btn" disabled={loading} id="contact-submit">
                {loading ? 'Sending...' : 'Send it! →'}
              </button>
            </div>
          </form>

          <div className="contact-sidebar">
            <div className="contact-sidebar-section">
              <div className="contact-sidebar-label">Contact Details</div>
              <div className="contact-sidebar-links">
                <a href="mailto:devusaini159@gmail.com" className="contact-sidebar-link">devusaini159@gmail.com</a>
                <a href="tel:+917878586274" className="contact-sidebar-link">+91 78 78 58 62 74</a>
              </div>
            </div>

            <div className="contact-sidebar-section">
              <div className="contact-sidebar-label">Location</div>
              <div className="contact-sidebar-links">
                <span className="contact-sidebar-link" style={{ cursor: 'default' }}>Jaipur, Rajasthan, India</span>
              </div>
            </div>

            <div className="contact-sidebar-section">
              <div className="contact-sidebar-label">Socials</div>
              <div className="contact-sidebar-links">
                <a href="https://github.com/devusaini" target="_blank" rel="noopener noreferrer" className="contact-sidebar-link">Github</a>
                <a href="https://linkedin.com/in/devusaini" target="_blank" rel="noopener noreferrer" className="contact-sidebar-link">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-left">
          <span>© 2025 Edition</span>
        </div>
        <div className="footer-socials">
          <a href="https://github.com/devusaini" target="_blank" rel="noopener noreferrer" className="footer-social">Github</a>
          <a href="https://linkedin.com/in/devusaini" target="_blank" rel="noopener noreferrer" className="footer-social">LinkedIn</a>
        </div>
      </footer>
    </>
  );
};

export default ContactPage;
