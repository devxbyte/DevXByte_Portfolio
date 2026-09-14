import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Loader from './components/Loader';
import Header from './components/Header';
import Cursor from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PageTransition from './components/PageTransition';
import Chatbot from './components/Chatbot';
import { fetchHero, fetchAbout, fetchExperience, fetchProjects, fetchSkills, fetchEducation, fetchCertifications } from './utils/api';
import './styles/index.css';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState(null);
  const [about, setAbout] = useState(null);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Fetch all portfolio data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, aboutRes, expRes, projRes, skillRes, eduRes, certRes] = await Promise.allSettled([
          fetchHero(), fetchAbout(), fetchExperience(), fetchProjects(), fetchSkills(), fetchEducation(), fetchCertifications()
        ]);

        if (heroRes.status === 'fulfilled') {
          const heroData = heroRes.value.data;
          setHero(heroData);
          if (heroData?.image) {
            const getSafeFaviconUrl = (img) => {
              if (!img) return '/Devendra_Saini.png';
              if (img.includes('localhost') && !import.meta.env.DEV) return '/Devendra_Saini.png';
              if (img.startsWith('http')) return img;
              const safePath = img.startsWith('/') ? img : `/${img}`;
              return `${import.meta.env.VITE_BACKEND_URL}${safePath}`;
            };
            const faviconUrl = getSafeFaviconUrl(heroData.image);
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = 64;
              canvas.height = 64;
              const ctx = canvas.getContext('2d');
              ctx.beginPath();
              ctx.arc(32, 32, 32, 0, Math.PI * 2);
              ctx.clip();
              const size = Math.min(img.width, img.height);
              const x = (img.width - size) / 2;
              const y = (img.height - size) / 2;
              ctx.drawImage(img, x, y, size, size, 0, 0, 64, 64);
              
              const link = document.querySelector("link[rel~='icon']");
              if (link) link.href = canvas.toDataURL("image/png");
            };
            img.src = faviconUrl;
          }
        }
        if (aboutRes.status === 'fulfilled') setAbout(aboutRes.value.data);
        if (expRes.status === 'fulfilled') setExperience(expRes.value.data);
        if (projRes.status === 'fulfilled') setProjects(projRes.value.data);
        if (skillRes.status === 'fulfilled') setSkills(skillRes.value.data);
        if (eduRes.status === 'fulfilled') setEducation(eduRes.value.data);
        if (certRes.status === 'fulfilled') setCertifications(certRes.value.data);
      } catch (err) {
        console.log('Using fallback data', err);
      }
    };
    fetchData();
  }, []);

  // Fallback data
  const heroData = hero?.name ? hero : {
    name: 'DEVENDRA SAINI', subtitle: 'Full-Stack Developer',
    description: 'Building ideas that inspire trust in the modern world. Together we will shape the next big vision.',
    typingTexts: ['Full-Stack Developer', 'React Developer', 'MERN Stack Developer'],
    socialLinks: { github: 'https://github.com/devusaini', linkedin: 'https://linkedin.com/in/devusaini' }
  };

  const projData = projects.length ? projects : [
    { title: 'BG Remover', description: 'Background remover tool with MERN stack', techStack: ['React', 'Node.js', 'Cloudinary'] },
    { title: 'Chat App', description: 'Real-time chat with Socket.io', techStack: ['React', 'Socket.io'] },
    { title: 'LMS Portal', description: 'Learning Management System', techStack: ['React', 'MongoDB'] }
  ];

  const skillData = skills.length ? skills : [
    { category: 'Programming', name: 'JavaScript', level: 90 },
    { category: 'Programming', name: 'Node.js', level: 85 },
    { category: 'Frameworks', name: 'React JS', level: 90 },
    { category: 'Frameworks', name: 'Express.js', level: 82 },
    { category: 'Tools', name: 'Git & GitHub', level: 85 }
  ];

  const expData = experience.length ? experience : [
    { company: 'MetaBlock Technologies', role: 'ReactJS Developer Intern', startDate: 'April 2025', endDate: 'Present' }
  ];

  const eduData = education.length ? education : [
    { institution: 'MJRPU', degree: 'Bachelor of Computer Applications', location: 'Jaipur', startDate: 'Aug 2022', endDate: 'Present' }
  ];

  const certData = certifications.length ? certifications : [
    { title: 'AU Ignite Future Skills', issuer: 'Salesforce', description: 'Salesforce Developer' },
    { title: 'React Bootcamp', issuer: 'LetsUpgrade', description: 'React certification' }
  ];

  return (
    <ThemeProvider>
      <BrowserRouter>
        {loading && <Loader onComplete={() => setLoading(false)} />}
        <Cursor />
        <ScrollProgress />
        <Header />
        <ScrollToTop />

        <main>
          <Routes>
            <Route path="/" element={<PageTransition><HomePage hero={heroData} about={about} projects={projData} skills={skillData} /></PageTransition>} />
            <Route path="/work" element={<PageTransition><WorkPage projects={projData} /></PageTransition>} />

            <Route path="/about" element={<PageTransition><AboutPage hero={heroData} about={about} experience={expData} skills={skillData} education={eduData} certifications={certData} /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          </Routes>
        </main>
        
        <Chatbot />

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '12px'
            }
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
