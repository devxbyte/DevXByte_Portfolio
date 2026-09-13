import React, { useEffect, useRef, useState } from 'react';
import TagCloud from 'TagCloud';

const GlobeSkills = ({ skills }) => {
  const containerRef = useRef(null);
  const tcInstance = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // To prevent multiple instances during React strict mode or re-renders
    containerRef.current.innerHTML = '';

    const texts = skills?.length 
      ? skills.map(s => s.name)
      : ['React', 'Node.js', 'MongoDB', 'JavaScript', 'HTML/CSS', 'Tailwind', 'Next.js', 'Figma', 'TypeScript', 'Git', 'Express', 'Python', 'GSAP', 'Vite', 'Three.js'];

    // Adjust radius based on screen width for responsiveness
    const radius = window.innerWidth < 768 ? 150 : 250;

    const options = {
      radius: radius,
      maxSpeed: 'normal',
      initSpeed: 'normal',
      direction: 135,
      keep: true
    };

    tcInstance.current = TagCloud(containerRef.current, texts, options);

    return () => {
      if (tcInstance.current) {
        try { tcInstance.current.destroy(); } catch (e) {}
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [skills]);

  return (
    <div 
      className="globe-skills-wrapper" 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        minHeight: '500px',
        cursor: 'pointer'
      }}
    >
      <div className="globe-skills-content" ref={containerRef}></div>
    </div>
  );
};

export default GlobeSkills;
