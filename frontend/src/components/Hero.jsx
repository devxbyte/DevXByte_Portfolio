import { useEffect, useRef, useState } from 'react';
import { gsap } from '../hooks/useGsap';
import { getImageUrl } from '../utils/api';
import ThreeBackground from './ThreeBackground';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';

const Hero = ({ data }) => {
  const nameRef = useRef(null);
  const [typingText, setTypingText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = data?.typingTexts || ['Full-Stack Developer', 'React Developer', 'MERN Stack Developer'];

  // Name character animation
  useEffect(() => {
    if (!nameRef.current || !data?.name) return;

    const name = data.name;
    nameRef.current.innerHTML = name.split('').map(c =>
      c === ' ' ? '<span class="char" style="width:20px">&nbsp;</span>' :
      `<span class="char">${c}</span>`
    ).join('');

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(nameRef.current.querySelectorAll('.char'), {
      opacity: 1,
      y: 0,
      stagger: 0.04,
      duration: 0.6,
      ease: 'power3.out'
    })
    .to('.hero-greeting', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0)
    .to('.hero-description', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.5)
    .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.7)
    .to('.hero-socials', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.9);
  }, [data]);

  // Typing effect
  useEffect(() => {
    const currentText = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypingText(currentText.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);

        if (charIndex + 1 === currentText.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setTypingText(currentText.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);

        if (charIndex === 0) {
          setIsDeleting(false);
          setTextIndex(prev => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      <ThreeBackground />

      <div className="hero-content">
        <p className="hero-greeting" style={{ transform: 'translateY(20px)' }}>
          👋 Hello, I'm
        </p>

        <h1 className="hero-name" ref={nameRef}></h1>

        <div className="hero-role">
          I'm a <span className="typing-text">{typingText}</span>
          <span className="cursor-blink"></span>
        </div>

        <p className="hero-description" style={{ transform: 'translateY(20px)' }}>
          {data?.description || 'I build dynamic web applications with modern technologies.'}
        </p>

        <div className="hero-buttons" style={{ transform: 'translateY(20px)' }}>
          <button className="btn btn-primary" onClick={scrollToContact}>
            Get In Touch
          </button>
          {data?.resumeUrl && (
            <a href={getImageUrl(data.resumeUrl)} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
              <HiDownload /> Resume
            </a>
          )}
        </div>

        <div className="hero-socials" style={{ transform: 'translateY(20px)' }}>
          {data?.socialLinks?.github && (
            <a href={data.socialLinks.github} className="social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
          )}
          {data?.socialLinks?.linkedin && (
            <a href={data.socialLinks.linkedin} className="social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          )}
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-mouse"></div>
        <span>Scroll</span>
      </div>
    </section>
  );
};

export default Hero;
