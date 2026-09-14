import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import GlobeSkills from '../components/GlobeSkills';

gsap.registerPlugin(ScrollTrigger);

const HolographicImage = ({ image }) => {
  const cardRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const wrapper = wrapperRef.current;
    if (!card || !wrapper) return;

    const handleMouseMove = (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -15; 
      const rotateY = ((x - centerX) / centerX) * 15;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    };

    wrapper.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      wrapper.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="holo-wrapper" ref={wrapperRef}>
      <div className="holo-card" ref={cardRef}>
        <div className="holo-border"></div>
        <div className="holo-glass">
          {(() => {
            const getSafeImage = (img) => {
              if (!img) return '/Devendra_Saini.png';
              if (img.includes('localhost') && !import.meta.env.DEV) return '/Devendra_Saini.png';
              if (img.startsWith('http')) return img;
              const safePath = img.startsWith('/') ? img : `/${img}`;
              return `${import.meta.env.VITE_BACKEND_URL}${safePath}`;
            };
            const finalImage = getSafeImage(image);
            return <img src={finalImage} alt="Profile" />;
          })()}
        </div>
        <span className="holo-accent top-left"></span>
        <span className="holo-accent top-right"></span>
        <span className="holo-accent bottom-left"></span>
        <span className="holo-accent bottom-right"></span>
      </div>
    </div>
  );
};

const AboutPage = ({ hero, about, experience, skills, education, certifications }) => {
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    gsap.fromTo('.about-hero-image', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' });
    gsap.fromTo('.about-hero-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, delay: 0.1, ease: 'power3.out' });
    gsap.fromTo('.about-hero-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' });

    gsap.utils.toArray('.about-service-item').forEach((item, i) => {
      gsap.fromTo(item, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 90%' }
      });
    });

    gsap.utils.toArray('.experience-item').forEach((item, i) => {
      gsap.fromTo(item, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 92%' }
      });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  const grouped = skills?.reduce((a, s) => { if (!a[s.category]) a[s.category] = []; a[s.category].push(s); return a; }, {}) || {};

  const getFileUrl = (path) => {
    if (!path) return "/resume.pdf";
    if (path.startsWith('http')) return path;
    const normalizedPath = path.replace(/\\/g, '/');
    const safePath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    return `${import.meta.env.VITE_BACKEND_URL}${safePath}`;
  };

  const resumeUrl = getFileUrl(hero?.resumeUrl);

  return (
    <>
      <section className="about-page">
        <div className="about-hero-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '60px', flexWrap: 'wrap', marginBottom: '60px' }}>
          <div className="about-hero-text" style={{ flex: '1 1 500px' }}>
            <h1 className="about-hero-title" style={{ marginTop: 0 }}>
              Helping brands shine in the digital space
            </h1>
            <p className="about-hero-sub">
              {about?.description || "I help companies worldwide with custom solutions. Each project takes my work further, always focused on quality. Always exploring..."}
            </p>
            <a 
              href={resumeUrl} 
              download="Devendra_Saini_Resume.pdf"
              target="_blank" 
              rel="noopener noreferrer" 
              className="resume-btn"
            >
              Download Resume
              <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </a>
          </div>
          
          {hero?.image && (
            <div className="about-hero-image-container" style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '350px' }}>
              <HolographicImage image={hero.image} />
            </div>
          )}
        </div>

        {/* Services/What I do */}
        <div className="about-services">
          <h2 className="about-services-title">I can help you with ...</h2>
          <div className="about-service-items">
            <div className="about-service-item">
              <div className="about-service-num">01</div>
              <div className="about-service-name">Frontend</div>
              <p className="about-service-desc">
                With a strong focus on frontend development, I create modern, responsive interfaces with smooth animations and clean user experiences.
              </p>
            </div>
            <div className="about-service-item">
              <div className="about-service-num">02</div>
              <div className="about-service-name">Backend</div>
              <p className="about-service-desc">
                I build scalable and secure backends that integrate seamlessly with frontend. My work ensures performance, reliability, and flexibility.
              </p>
            </div>
            <div className="about-service-item">
              <div className="about-service-num">03</div>
              <div className="about-service-name">Full-Stack</div>
              <p className="about-service-desc">
                From concept to deployment, I deliver complete full-stack solutions. My combined frontend and backend skills enable me to craft impactful, end-to-end projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="experience-section">
        <h2 className="experience-title">Work Experience</h2>
        <div className="experience-list">
          {(experience || []).map((exp, i) => (
            <div key={exp._id || i} className="experience-item">
              <div className="exp-company">{exp.company}</div>
              <div className="exp-role">{exp.role}</div>
              <div className="exp-date">{exp.startDate} — {exp.endDate}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="education-section">
        <h2 className="edu-title" style={{ marginBottom: '10px' }}>Skills & Technologies</h2>
        
        {/* Interactive Globe Skills */}
        <div style={{ marginBottom: '60px' }}>
          <GlobeSkills skills={skills} />
        </div>

        <div className="skills-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          {skills?.map((skill, i) => (
            <div key={skill._id || i} className="skill-badge" style={{ 
              padding: '10px 20px', 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border)', 
              borderRadius: '8px', 
              fontSize: '15px', 
              fontWeight: '500',
              color: 'var(--text-primary)',
              transition: 'all 0.3s ease',
              cursor: 'default',
              flex: '1 1 auto',
              textAlign: 'center'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            >
              {skill.name}
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="education-section">
        <h2 className="edu-title">Education</h2>
        {(education || []).map((edu, i) => (
          <div key={edu._id || i} className="edu-item">
            <div>
              <div className="edu-name">{edu.degree}</div>
              <div className="edu-detail">{edu.institution}{edu.location ? ` • ${edu.location}` : ''}</div>
            </div>
            <div className="edu-date">{edu.startDate} — {edu.endDate}</div>
          </div>
        ))}
      </section>

      {/* Certifications */}
      <section className="education-section">
        <h2 className="edu-title">Certifications</h2>
        <div className="certs-grid">
          {(certifications || []).map((cert, i) => (
            <div key={cert._id || i} className="cert-card">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setSelectedCert(cert); }} 
                data-image={cert.image}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%', height: '100%' }}
              >
                <div className="cert-name">{cert.title}</div>
                <div className="cert-issuer">{cert.issuer}</div>
                {cert.description && <div className="cert-desc">{cert.description}</div>}
              </a>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
      <Footer />

      <Modal 
        isOpen={!!selectedCert} 
        onClose={() => setSelectedCert(null)} 
        data={selectedCert} 
        type="certificate" 
      />
    </>
  );
};

export default AboutPage;
