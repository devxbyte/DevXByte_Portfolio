import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGsapFadeIn, useGsapStagger } from '../hooks/useGsap';

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
      
      // Calculate rotation (max 15 degrees)
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

const About = ({ data }) => {
  const sectionRef = useGsapFadeIn();
  const highlightsRef = useGsapStagger('.highlight-card');

  if (!data || !data.title) return null;

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-header" ref={sectionRef}>
          <span className="section-label">Get To Know</span>
          <h2 className="section-title">{data.title}</h2>
        </div>

        <div className="about-grid">
          <div className="about-image-wrapper">
            <HolographicImage image={data.image} />
          </div>

          <div className="about-text">
            <h3>
              A Passionate <span className="gradient-text">Full-Stack Developer</span>
            </h3>
            <p>{data.description}</p>

            {data.highlights && data.highlights.length > 0 && (
              <div className="about-highlights" ref={highlightsRef}>
                {data.highlights.map((h, i) => (
                  <div key={i} className="highlight-card">
                    <div className="highlight-value">{h.value}</div>
                    <div className="highlight-label">{h.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
