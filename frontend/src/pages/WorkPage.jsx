import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

gsap.registerPlugin(ScrollTrigger);

const WorkPage = ({ projects }) => {
  useEffect(() => {
    gsap.fromTo('.work-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    gsap.utils.toArray('.work-project-item').forEach((item) => {
      gsap.fromTo(item, { opacity: 0, x: 40 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play reverse play reverse' }
      });
    });
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [projects]);

  return (
    <>
      <section style={{ padding: '120px 24px 40px' }}>
        <h1 className="work-title" style={{
          fontSize: 'clamp(32px, 8vw, 100px)',
          fontWeight: 400,
          letterSpacing: '-3px',
          lineHeight: 1.1,
          marginBottom: '32px'
        }}>
          Creating next level<br />digital products
        </h1>
      </section>

      <div className="project-list" style={{ borderTop: '1px solid var(--border)' }}>
        {(projects || []).map((project, i) => (
          <div key={project._id || i} className="project-item work-project-item">
            <a 
              href={project.liveUrl || project.githubUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              data-image={project.image}
            >
              <span className="project-name">{project.title}</span>
              <div className="project-meta">
                <div className="project-type">{project.techStack?.slice(0, 2).join(' & ') || 'Design & Development'}</div>
                <div className="project-year">2025</div>
              </div>
            </a>
          </div>
        ))}
      </div>

      <CTASection />
      <Footer />
    </>
  );
};

export default WorkPage;
