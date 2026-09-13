import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../hooks/useGsap';
import { useGsapFadeIn } from '../hooks/useGsap';

const Skills = ({ data }) => {
  const sectionRef = useGsapFadeIn();
  const skillsRef = useRef(null);

  // Group skills by category
  const grouped = data?.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {}) || {};

  useEffect(() => {
    if (!skillsRef.current || !data?.length) return;

    const fills = skillsRef.current.querySelectorAll('.skill-fill');
    fills.forEach(fill => {
      const width = fill.getAttribute('data-width');
      gsap.to(fill, {
        width: `${width}%`,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: fill,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
    });
  }, [data]);

  if (!data || !data.length) return null;

  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="section-header" ref={sectionRef}>
          <span className="section-label">Expertise</span>
          <h2 className="section-title">Skills & Technologies</h2>
        </div>

        <div className="skills-categories" ref={skillsRef}>
          {Object.entries(grouped).map(([category, skills]) => (
            <div key={category} className="skill-category">
              <h3>{category}</h3>
              <div className="skills-grid">
                {skills.map((skill, i) => (
                  <div key={skill._id || i} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-fill" data-width={skill.level}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
