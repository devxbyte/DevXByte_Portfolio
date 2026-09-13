import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const loaderRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Scroll to top immediately on route change
    window.scrollTo(0, 0);

    // Initial state: columns cover the screen, content is slightly zoomed out
    gsap.set(loaderRef.current.querySelectorAll('.loader-column'), { scaleY: 1 });
    gsap.set(contentRef.current, { scale: 0.9, opacity: 0 });

    // Animate columns sliding up (like the initial loader) and content revealing from inside
    const tl = gsap.timeline();
    
    tl.to(loaderRef.current.querySelectorAll('.loader-column'), {
      scaleY: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power4.inOut',
      transformOrigin: 'top'
    })
    .to(contentRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      clearProps: 'all'
    }, "-=0.6");

  }, [location.pathname]);

  return (
    <>
      <div 
        className="page-loader" 
        ref={loaderRef} 
        style={{ zIndex: 99999, pointerEvents: 'none', backgroundColor: 'transparent' }}
      >
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="loader-column" 
            style={{ display: 'flex', flex: 1, backgroundColor: 'var(--bg-dark)' }} 
          />
        ))}
      </div>

      <div ref={contentRef} style={{ width: '100%', minHeight: '100vh' }}>
        {children}
      </div>
    </>
  );
};

export default PageTransition;
