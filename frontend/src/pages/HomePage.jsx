import { useEffect, useRef, lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import DraggableIDCard from '../components/DraggableIDCard';
import Modal from '../components/Modal';


/* Lazy load Three.js components — only downloaded on desktop */
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const HeroParticles = isMobile ? () => null : lazy(() => import('../components/HeroParticles'));
const FloatingShapes = isMobile ? () => null : lazy(() => import('../components/FloatingShapes'));
const GlowGrid = isMobile ? () => null : lazy(() => import('../components/GlowGrid'));

gsap.registerPlugin(ScrollTrigger);

const HomePage = ({ hero, about, projects, skills }) => {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const horizontalScrollRef = useRef(null);
  const ctaPanelRef = useRef(null);

  useEffect(() => {
    // Hero animations
    gsap.fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' });
    gsap.fromTo('.hero-location', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: 'power3.out' });
    gsap.fromTo('.hero-bottom', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: 'power3.out' });

    // About section animation
    gsap.fromTo('.about-brief-title', { opacity: 0, y: 60 }, {
      opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-brief', start: 'top 75%' }
    });
    gsap.fromTo('.about-brief-right', { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-brief', start: 'top 75%' }
    });

    // Project items animation - smooth slide from right, reverse on scroll up
    gsap.utils.toArray('.project-item').forEach((item) => {
      gsap.fromTo(item, { opacity: 0, x: 40 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 85%' }
      });
    });

    // Skills marquee stagger reveal
    gsap.fromTo('.skills-marquee', { opacity: 0 }, {
      opacity: 1, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.skills-marquee', start: 'top 85%' }
    });

    // Pin the projects section when its bottom hits the bottom of the viewport
    if (projectsRef.current) {
      ScrollTrigger.create({
        trigger: projectsRef.current,
        start: 'bottom bottom',
        pin: true,
        pinSpacing: false,
      });
    }

    // Preload project images for instant hover effect
    if (projects && projects.length > 0) {
      projects.slice(0, 4).forEach(project => {
        if (project.image) {
          const img = new Image();
          img.src = project.image;
        }
      });
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [projects]);

  const name = hero?.name || 'DEVENDRA SAINI';
  const skillNames = skills?.map(s => s.name) || ['React', 'Node.js', 'MongoDB', 'JavaScript', 'GSAP', 'HTML', 'CSS', 'Express'];
  
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
      {/* ===== HERO SECTION ===== */}
      <section className="hero sticky-hero" ref={heroRef}>
        {/* Three.js Particle Background — lazy loaded, skipped on mobile */}
        <Suspense fallback={null}><HeroParticles /></Suspense>

        {/* ── Fullscreen Lanyard Badge ── */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 50,
          pointerEvents: 'none',
        }}>
          <DraggableIDCard
            name={hero?.name?.trim() ? hero.name.trim().toUpperCase() : 'DEVENDRA SAINI'}
            role={hero?.subtitle || 'Web Developer'}
            description={hero?.description ? hero.description.split('.').slice(0, 1).join('.') + '.' : 'I build beautiful, responsive websites.'}
            photoUrl={(() => {
              if (!hero?.image) return '/Devendra_Saini.png';
              if (hero.image.includes('localhost') && !import.meta.env.DEV) return '/Devendra_Saini.png';
              if (hero.image.startsWith('http')) return hero.image;
              const safePath = hero.image.startsWith('/') ? hero.image : `/${hero.image}`;
              return `${import.meta.env.VITE_BACKEND_URL}${safePath}`;
            })()}
            linkedin={hero?.socialLinks?.linkedin || 'https://www.linkedin.com/in/devxbyte/?skipRedirect=true'}
            github={hero?.socialLinks?.github || 'https://github.com/devxbyte'}
            instagram={hero?.socialLinks?.instagram || 'https://www.instagram.com/dev.__saini?stkn=MTBuNGJ6YTY3N3hkYw=='}
          />
        </div>

        <div className="hero-content">
          <div className="hero-top">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              Available for freelance
            </div>
            <div className="hero-location">
              Located in the<br />Jaipur, Rajasthan
            </div>
          </div>

          {/* Name Marquee */}
          <div className="hero-marquee" style={{ position: 'relative' }}>
            <div className="marquee-track">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="marquee-text">
                  {name.split(' ')[0]} <span className="outline">{name.split(' ')[1] || 'SAINI'}</span>
                  <span className="marquee-separator">
                    <svg viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hero-description">
              <div className="hero-subtitle">Freelance Full-Stack Developer</div>
              <p className="hero-desc-text">
                {hero?.description || 'Building ideas that inspire trust in the modern world. Together we will shape the next big vision. No limits, always pushing the boundaries.'}
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
            <div className="hero-cta">
              <div className="hero-scroll">
                <span>Scroll</span>
                <div className="hero-scroll-arrows">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline className="arrow-1" points="7 13 12 18 17 13"></polyline>
                    <polyline className="arrow-2" points="7 6 12 11 17 6"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OVERLAY CONTENT FOR STICKY SCROLL ===== */}
      <div className="overlay-content">
        {/* ===== ABOUT BRIEF ===== */}
        <section className="about-brief about-brief--enhanced" ref={aboutRef}>
        {/* Three.js Floating Shapes Background — lazy loaded, skipped on mobile */}
        <Suspense fallback={null}><FloatingShapes /></Suspense>

        <div className="about-brief-left">
          <div className="about-brief-label">About</div>
          <h2 className="about-brief-title">
            {about?.description?.split('.').slice(0, 2).join('.') + '.' || 'Helping brands shine in the digital space. I help companies worldwide with custom solutions.'}
          </h2>
        </div>
        <div className="about-brief-right">
          <p className="about-brief-desc">
            Blending my creativity with code & strategy allows me to craft digital experiences that truly stand out.
          </p>
          <Link to="/about" className="about-link">
            About me →
          </Link>
        </div>
      </section>

      {/* ===== SKILLS MARQUEE ===== */}
      <section className="skills-marquee" id="skills-section">
        <div className="skills-marquee-label">Skills that shape my craft</div>
        <div className="skills-track">
          {[...skillNames, ...skillNames].map((skill, i) => (
            <span key={i} className="skill-tag">
              <span className="dot"></span>
              {skill}
            </span>
          ))}
        </div>
        <div className="skills-track skills-track-reverse">
          {[...skillNames, ...skillNames].map((skill, i) => (
            <span key={`r-${i}`} className="skill-tag">
              <span className="dot"></span>
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* ===== PROJECTS ===== */}
      <section className="projects-section projects-section--enhanced" ref={projectsRef}>
        <Suspense fallback={null}><GlowGrid /></Suspense>

        <div className="projects-header">
          <div className="projects-label">Recent work</div>
        </div>

        <div className="project-list">
          {(projects || []).slice(0, 4).map((project, i) => (
            <div key={project._id || i} className="project-item">
              <a 
                href={project.liveUrl || project.githubUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                data-image={project.image}
              >
                <span className="project-name">{project.title}</span>
                <div className="project-meta">
                  <div className="project-type">{project.techStack?.slice(0, 2).join(' & ') || 'Design & Development'}</div>
                </div>
              </a>
            </div>
          ))}
        </div>

        <div className="more-work-wrapper">
          <Link to="/work">
            <button className="more-work-btn">More work</button>
          </Link>
        </div>
      </section>

      {/* ===== OVERLAPPING CTA & FOOTER ===== */}
      <div className="cta-footer-overlay">
        {/* ===== CTA ===== */}
        <CTASection />

        <Footer />
      </div>
      </div>
    </>
  );
};

export default HomePage;
