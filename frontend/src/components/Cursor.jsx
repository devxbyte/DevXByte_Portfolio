import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const TRAIL_LENGTH = 15;

const Cursor = () => {
  // Hide cursor trail on mobile & tablet (touch devices or small screens)
  const isTouchDevice = typeof window !== 'undefined' && (
    'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024
  );
  if (isTouchDevice) return null;

  const cursorRef = useRef(null);
  const labelRef = useRef(null);
  const previewRef = useRef(null);
  const trailRefs = useRef([]);
  
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const lastMouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const trail = useRef(Array.from({ length: TRAIL_LENGTH }, () => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 })));
  
  const [projectImage, setProjectImage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const location = useLocation();
  
  // Timeout ref for floating effect decay
  const hoverTimeout = useRef(null);

  useEffect(() => {
    // Reset cursor state unconditionally on route change
    const cursor = cursorRef.current;
    if (cursor) {
      cursor.classList.remove('hovered');
      cursor.classList.remove('project-hover');
    }
    setShowPreview(false);
  }, [location.pathname]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const preview = previewRef.current;
    if (!cursor || !preview) return;

    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const speedX = e.clientX - lastMouse.current.x;
      const speedY = e.clientY - lastMouse.current.y;
      lastMouse.current.x = e.clientX;
      lastMouse.current.y = e.clientY;

      // Ensure cursor centers accurately using GSAP xPercent/yPercent
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.15,
        ease: 'power2.out'
      });
      
      // Center preview exactly beneath cursor and add waving/floating effect
      gsap.to(preview, {
        x: e.clientX,
        y: e.clientY,
        xPercent: -50,
        yPercent: -50,
        rotation: gsap.utils.clamp(-15, 15, speedX * 0.15),
        skewX: gsap.utils.clamp(-10, 10, speedX * 0.05),
        skewY: gsap.utils.clamp(-10, 10, speedY * 0.05),
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto'
      });

      // Gently settle the image back to rest when mouse stops moving
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = setTimeout(() => {
        gsap.to(preview, {
          rotation: 0,
          skewX: 0,
          skewY: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)'
        });
      }, 50);
    };

    const addHover = () => cursor.classList.add('hovered');
    const removeHover = () => cursor.classList.remove('hovered');
    
    const addProject = (e) => { 
      cursor.classList.add('project-hover'); 
      cursor.classList.remove('hovered'); 
      
      const link = e.currentTarget.querySelector('a');
      if (link && link.dataset.image) {
        setProjectImage(link.dataset.image);
        setShowPreview(true);
      }
    };
    
    const removeProject = () => {
      cursor.classList.remove('project-hover');
      setShowPreview(false);
    };

    document.addEventListener('mousemove', move);

    // Delayed binding to allow DOM to settle
    const bindHovers = () => {
      document.querySelectorAll('a, button, .menu-btn, .nav-link-item').forEach(el => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
      });

      document.querySelectorAll('.project-item, .cert-card').forEach(el => {
        el.addEventListener('mouseenter', addProject);
        el.addEventListener('mouseleave', removeProject);
      });
    };

    bindHovers();
    const observer = new MutationObserver(bindHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    let frameId;
    const renderTrail = () => {
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        if (i === 0) {
          trail.current[i].x += (mouse.current.x - trail.current[i].x) * 0.3;
          trail.current[i].y += (mouse.current.y - trail.current[i].y) * 0.3;
        } else {
          trail.current[i].x += (trail.current[i - 1].x - trail.current[i].x) * 0.25;
          trail.current[i].y += (trail.current[i - 1].y - trail.current[i].y) * 0.25;
        }

        const el = trailRefs.current[i];
        if (el) {
          el.style.transform = `translate(${trail.current[i].x}px, ${trail.current[i].y}px)`;
          // Rapidly update binary characters to look like glitching bits
          if (Math.random() < 0.4) {
            el.innerText = Math.random() > 0.5 ? '1' : '0';
          }
        }
      }
      frameId = requestAnimationFrame(renderTrail);
    };
    frameId = requestAnimationFrame(renderTrail);

    return () => {
      document.removeEventListener('mousemove', move);
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor-trail" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9997 }}>
        {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
          <span 
            key={i} 
            ref={el => trailRefs.current[i] = el}
            style={{
              position: 'absolute',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: `${16 - i * 0.4}px`,
              opacity: Math.max(0, 1 - (i / TRAIL_LENGTH)),
              left: 0,
              top: 0,
              transform: 'translate(-50%, -50%)',
              fontWeight: 700,
              willChange: 'transform'
            }}
          >
            0
          </span>
        ))}
      </div>
      <div className="cursor-main" ref={cursorRef}>
        <span className="cursor-label" ref={labelRef}>View</span>
      </div>
      <div className={`project-preview ${showPreview ? 'visible' : ''}`} ref={previewRef} style={{ top: 0, left: 0 }}>
        {projectImage && <img src={projectImage} alt="Project Preview" />}
      </div>
    </>
  );
};

export default Cursor;
