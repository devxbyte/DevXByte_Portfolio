import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ManageHero = () => {
  const { api } = useAuth();
  const [form, setForm] = useState({
    name: '', subtitle: '', description: '', typingTexts: [], image: '',
    resumeUrl: '', socialLinks: { github: '', linkedin: '', twitter: '', instagram: '' }
  });
  const [typingInput, setTypingInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/hero', { baseURL: import.meta.env.VITE_API_URL })
      .then(res => { if (res.data && res.data.name) setForm(res.data); })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const key = name.split('.')[1];
      setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ ...form, image: `${import.meta.env.VITE_BACKEND_URL}${res.data.url}` });
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Upload failed');
    }
    setLoading(false);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ ...form, resumeUrl: `${import.meta.env.VITE_BACKEND_URL}${res.data.url}` });
      toast.success('Resume uploaded');
    } catch (err) {
      toast.error('Upload failed');
    }
    setLoading(false);
  };

  const addTypingText = () => {
    if (typingInput.trim()) {
      setForm({ ...form, typingTexts: [...form.typingTexts, typingInput.trim()] });
      setTypingInput('');
    }
  };

  const removeTypingText = (index) => {
    setForm({ ...form, typingTexts: form.typingTexts.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/hero', form);
      toast.success('Hero section updated! ✨');
    } catch (err) {
      toast.error('Failed to update');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hero Section</h1>
          <p className="page-subtitle">Manage your hero/landing section</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Subtitle</label>
              <input className="form-input" name="subtitle" value={form.subtitle} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Typing Texts</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input className="form-input" value={typingInput} onChange={e => setTypingInput(e.target.value)}
                placeholder="Add a typing text..." onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTypingText())} />
              <button type="button" className="btn btn-primary" onClick={addTypingText}>Add</button>
            </div>
            <div className="tags-container">
              {form.typingTexts.map((text, i) => (
                <span key={i} className="tag">{text} <button type="button" onClick={() => removeTypingText(i)}>×</button></span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Resume PDF</label>
            <input type="file" className="form-input" accept="application/pdf" onChange={handleResumeUpload} />
            {form.resumeUrl && <div style={{marginTop: '10px'}}><a href={form.resumeUrl} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary)', textDecoration: 'underline'}}>View Uploaded Resume</a></div>}
          </div>

          <div className="form-group">
            <label className="form-label">Center Image</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {form.image && <img src={form.image} alt="Hero" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="form-input" />
            </div>
          </div>

          <div className="form-section-title">Social Links</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">GitHub</label>
              <input className="form-input" name="social.github" value={form.socialLinks?.github || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn</label>
              <input className="form-input" name="social.linkedin" value={form.socialLinks?.linkedin || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Instagram</label>
              <input className="form-input" name="social.instagram" value={form.socialLinks?.instagram || ''} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '16px' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageHero;
