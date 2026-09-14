import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';

const ManageProjects = () => {
  const { api } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', image: '', techStack: [], liveUrl: '', githubUrl: '', featured: false, order: 0 });
  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProjects = () => {
    api.get('/projects', { baseURL: (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://backend-pi-rosy-72.vercel.app/api') })
      .then(res => setProjects(res.data)).catch(() => {});
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
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

  const addTech = () => { if (techInput.trim()) { setForm({ ...form, techStack: [...form.techStack, techInput.trim()] }); setTechInput(''); } };
  const removeTech = (i) => setForm({ ...form, techStack: form.techStack.filter((_, idx) => idx !== i) });

  const openNew = () => { setEditing(null); setForm({ title: '', description: '', image: '', techStack: [], liveUrl: '', githubUrl: '', featured: false, order: 0 }); setShowModal(true); };
  const openEdit = (proj) => { setEditing(proj._id); setForm(proj); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) { await api.put(`/projects/${editing}`, form); }
      else { await api.post('/projects', form); }
      toast.success(editing ? 'Project updated!' : 'Project created!');
      setShowModal(false); fetchProjects();
    } catch { toast.error('Failed to save'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await api.delete(`/projects/${id}`); toast.success('Deleted'); fetchProjects(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Projects</h1><p className="page-subtitle">Manage your portfolio projects</p></div>
        <button className="btn btn-primary" onClick={openNew}><HiPlus /> Add Project</button>
      </div>

      <div className="item-list">
        {projects.map(proj => (
          <div key={proj._id} className="item-card">
            <div className="item-info">
              <h4>{proj.title} {proj.featured && <span className="badge badge-info">Featured</span>}</h4>
              <p>{proj.techStack?.join(', ')}</p>
            </div>
            <div className="item-actions">
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(proj)}><HiPencil /></button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(proj._id)}><HiTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editing ? 'Edit' : 'Add'} Project</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Title</label><input className="form-input" name="title" value={form.title} onChange={handleChange} required /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} required /></div>
              <div className="form-group">
                <label className="form-label">Project Image / Thumbnail</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {form.image && <img src={form.image} alt="Project" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tech Stack</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input className="form-input" value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="Add tech..."
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTech())} />
                  <button type="button" className="btn btn-primary btn-sm" onClick={addTech}>+</button>
                </div>
                <div className="tags-container">
                  {form.techStack?.map((t, i) => (<span key={i} className="tag">{t}<button type="button" onClick={() => removeTech(i)}>×</button></span>))}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Live URL</label><input className="form-input" name="liveUrl" value={form.liveUrl || ''} onChange={handleChange} /></div>
                <div className="form-group"><label className="form-label">GitHub URL</label><input className="form-input" name="githubUrl" value={form.githubUrl || ''} onChange={handleChange} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Order</label><input className="form-input" type="number" name="order" value={form.order} onChange={handleChange} /></div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '24px' }}>
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> <label className="form-label" style={{ margin: 0 }}>Featured</label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
