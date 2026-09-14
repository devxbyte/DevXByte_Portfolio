import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const greetings = [
  "Hello", "नमस्ते", "Bonjour", "Hola", "Ciao", "Olá", "Hallo", "こんにちは", "مرحبا"
];

const Loader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const textRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < greetings.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 100);

    // After cycling finishes (100ms * greetings.length = ~900ms)
    // start the slide up animation
    const timeout = setTimeout(() => {
      if (textRef.current) {
        gsap.to(textRef.current, { opacity: 0, duration: 0.2 });
      }
      
      if (loaderRef.current) {
        gsap.to(loaderRef.current.querySelectorAll('.loader-column'), {
          scaleY: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: 'power4.inOut',
          transformOrigin: 'top',
          onComplete
        });
      }
    }, 1100);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <>
      <div className="page-loader" ref={loaderRef} style={{ zIndex: 99999 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="loader-column" style={{ display: 'flex', flex: 1, backgroundColor: 'var(--bg-dark)' }} />
        ))}
      </div>
      <div 
        ref={textRef}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100000,
          color: '#fff',
          fontSize: 'clamp(40px, 8vw, 80px)',
          fontWeight: 400,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap'
        }}
      >
        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent)', marginRight: '16px', verticalAlign: 'middle' }}></span>
        {greetings[currentIndex]}
      </div>
    </>
  );
};

export default Loader;
