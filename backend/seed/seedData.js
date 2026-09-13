const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Admin = require('../models/Admin');
const Hero = require('../models/Hero');
const About = require('../models/About');
const Experience = require('../models/Experience');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const Settings = require('../models/Settings');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Promise.all([
      Admin.deleteMany({}),
      Hero.deleteMany({}),
      About.deleteMany({}),
      Experience.deleteMany({}),
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Education.deleteMany({}),
      Certification.deleteMany({}),
      Settings.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create Admin
    await Admin.create({
      name: 'Devendra Saini',
      email: 'devusaini159@gmail.com',
      password: 'admin123'
    });
    console.log('✅ Admin created');

    // Create Hero
    await Hero.create({
      name: 'Devendra Saini',
      subtitle: 'Full-Stack Developer',
      description: 'I build dynamic web applications with modern technologies. Passionate about creating efficient, scalable solutions.',
      typingTexts: ['Full-Stack Developer', 'React Developer', 'MERN Stack Developer', 'UI/UX Enthusiast'],
      resumeUrl: '',
      socialLinks: {
        github: 'https://github.com/devusaini',
        linkedin: 'https://linkedin.com/in/devusaini',
        twitter: '',
        instagram: ''
      }
    });
    console.log('✅ Hero created');

    // Create About
    await About.create({
      title: 'About Me',
      description: "I'm Devendra Saini, a Full-Stack Developer skilled in React.js, Node.js, MongoDB, HTML, CSS, and JavaScript. Currently pursuing a Bachelor of Computer Applications (BCA) at Mahatma Jyoti Rao Phoole University, Jaipur. I have hands-on experience in building dynamic web applications, developing RESTful APIs, and working with both frontend and backend technologies to deliver efficient, scalable solutions.",
      image: '',
      highlights: [
        { label: 'Experience', value: '1+ Years' },
        { label: 'Projects', value: '5+' },
        { label: 'Technologies', value: '10+' },
        { label: 'Location', value: 'Jaipur, India' }
      ]
    });
    console.log('✅ About created');

    // Create Experience
    await Experience.create({
      company: 'MetaBlock Technologies',
      role: 'ReactJS Developer Intern',
      location: 'Jaipur, Rajasthan',
      startDate: 'April 2025',
      endDate: 'Present',
      description: 'As a Frontend Developer Intern at Meta Block, I contributed to building responsive web interfaces using HTML, CSS, JavaScript, and React.js. I worked on reusable components, improved UI performance, and gained experience in agile development and team collaboration.',
      order: 1
    });
    console.log('✅ Experience created');

    // Create Projects
    await Project.create([
      {
        title: 'BG Remover',
        description: 'Developed a full-stack background remover tool using MERN stack. Integrated Cloudinary API or Remove.bg API for image processing.',
        image: '',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Cloudinary API'],
        liveUrl: '',
        githubUrl: '',
        featured: true,
        order: 1
      },
      {
        title: 'Chat App',
        description: 'Built a real-time chat application using MERN stack and Socket.io. Supported real-time messaging, typing indicators, and online status.',
        image: '',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
        liveUrl: '',
        githubUrl: '',
        featured: true,
        order: 2
      },
      {
        title: 'LMS Portal',
        description: 'Developed features like course creation, enrollment, content management, and progress tracking. Built a full-stack Learning Management System using MongoDB, Express.js, React.js, and Node.js.',
        image: '',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
        liveUrl: '',
        githubUrl: '',
        featured: true,
        order: 3
      }
    ]);
    console.log('✅ Projects created');

    // Create Skills
    await Skill.create([
      { category: 'Programming Languages', name: 'JavaScript', level: 90, order: 1 },
      { category: 'Programming Languages', name: 'HTML', level: 95, order: 2 },
      { category: 'Programming Languages', name: 'CSS', level: 90, order: 3 },
      { category: 'Programming Languages', name: 'Node.js', level: 85, order: 4 },
      { category: 'Programming Languages', name: 'MongoDB', level: 80, order: 5 },
      { category: 'Libraries & Frameworks', name: 'React JS', level: 90, order: 6 },
      { category: 'Libraries & Frameworks', name: 'Express.js', level: 82, order: 7 },
      { category: 'Libraries & Frameworks', name: 'GSAP', level: 75, order: 8 },
      { category: 'Libraries & Frameworks', name: 'Bootstrap', level: 85, order: 9 },
      { category: 'Libraries & Frameworks', name: 'Tailwind CSS', level: 88, order: 10 },
      { category: 'Tools & Platforms', name: 'Git & GitHub', level: 85, order: 11 },
      { category: 'Tools & Platforms', name: 'VS Code', level: 90, order: 12 },
      { category: 'Soft Skills', name: 'Communication', level: 85, order: 13 },
      { category: 'Soft Skills', name: 'Presentation', level: 80, order: 14 }
    ]);
    console.log('✅ Skills created');

    // Create Education
    await Education.create({
      institution: 'Mahatma Jyoti Rao Phoole University (MJRPU)',
      degree: 'Bachelor of Computer Applications',
      location: 'Jaipur',
      startDate: 'Aug 2022',
      endDate: 'Present',
      order: 1
    });
    console.log('✅ Education created');

    // Create Certifications
    await Certification.create([
      {
        title: 'AU Ignite Future Skills',
        issuer: 'Salesforce Developer',
        description: 'Salesforce Developer Certification',
        order: 1
      },
      {
        title: 'Web Page Designing & Development Program',
        issuer: 'Broadcast Engineering Consultants India Ltd',
        description: 'Web Page Designing & Development Program from Broadcast Engineering Consultants India Ltd',
        order: 2
      },
      {
        title: 'React Bootcamp',
        issuer: 'LetsUpgrade',
        description: 'React Bootcamp from LetsUpgrade',
        order: 3
      },
      {
        title: 'Node.js & MongoDB',
        issuer: 'IBM, Coursera',
        description: 'Developing Back-end Database Application From IBM, Coursera',
        order: 4
      }
    ]);
    console.log('✅ Certifications created');

    // Create Settings
    await Settings.create({
      siteTitle: 'Devendra Saini | Full-Stack Developer',
      metaDescription: 'Portfolio of Devendra Saini - Full-Stack Developer skilled in React.js, Node.js, MongoDB'
    });
    console.log('✅ Settings created');

    console.log('\n🎉 All demo data seeded successfully!');
    console.log('Admin Login: devusaini159@gmail.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
