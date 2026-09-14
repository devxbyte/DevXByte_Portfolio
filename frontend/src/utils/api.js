import axios from 'axios';

const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:5000/api' 
  : 'https://backend-pi-rosy-72.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchHero = () => api.get('/hero');
export const fetchAbout = () => api.get('/about');
export const fetchExperience = () => api.get('/experience');
export const fetchProjects = () => api.get('/projects');
export const fetchSkills = () => api.get('/skills');
export const fetchEducation = () => api.get('/education');
export const fetchCertifications = () => api.get('/certifications');
export const submitContact = (data) => api.post('/contact', data);

export default api;
