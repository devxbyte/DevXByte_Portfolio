import { useState } from 'react';
import { useGsapFadeIn } from '../hooks/useGsap';
import { submitContact } from '../utils/api';
import toast from 'react-hot-toast';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const Contact = () => {
  const sectionRef = useGsapFadeIn();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await submitContact(formData);
      toast.success('Message sent successfully! ✨');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
    setLoading(false);
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-header" ref={sectionRef}>
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">Contact Me</h2>
          <p className="section-subtitle">
            Have a project in mind or want to collaborate? Let's talk!
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h3>Let's work <span className="gradient-text">together</span></h3>
            <p>
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            <div className="contact-item">
              <div className="contact-icon"><HiMail /></div>
              <div className="contact-details">
                <h4>Email</h4>
                <span>devusaini159@gmail.com</span>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon"><HiPhone /></div>
              <div className="contact-details">
                <h4>Phone</h4>
                <span>+91 7878586274</span>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon"><HiLocationMarker /></div>
              <div className="contact-details">
                <h4>Location</h4>
                <span>Jaipur, Rajasthan, India</span>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} id="contact-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  id="contact-name"
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email *"
                  value={formData.email}
                  onChange={handleChange}
                  id="contact-email"
                />
              </div>
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                id="contact-subject"
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message *"
                value={formData.message}
                onChange={handleChange}
                id="contact-message"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} id="contact-submit">
              {loading ? 'Sending...' : 'Send Message ✨'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
