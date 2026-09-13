import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../hooks/useGsap';
import { useGsapFadeIn } from '../hooks/useGsap';
import { HiLocationMarker } from 'react-icons/hi';

const Experience = ({ data }) => {
  const sectionRef = useGsapFadeIn();
  const timelineRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (!timelineRef.current || !lineRef.current || !data?.length) return;

    // Animate timeline line drawing
    gsap.to(lineRef.current, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: timelineRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1
      }
    });

    // Animate timeline items
    const items = timelineRef.current.querySelectorAll('.timeline-item');
    items.forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }, [data]);

  if (!data || !data.length) return null;

  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-header" ref={sectionRef}>
          <span className="section-label">My Journey</span>
          <h2 className="section-title">Work Experience</h2>
        </div>

        <div className="timeline" ref={timelineRef}>
          <div className="timeline-line" ref={lineRef}></div>

          {data.map((exp, i) => (
            <div key={exp._id || i} className="timeline-item">
              <div className="timeline-header">
                <h3 className="timeline-company">{exp.company}</h3>
                <span className="timeline-date">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="timeline-role">{exp.role}</p>
              {exp.location && (
                <p className="timeline-location">
                  <HiLocationMarker style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  {exp.location}
                </p>
              )}
              <p className="timeline-desc">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
