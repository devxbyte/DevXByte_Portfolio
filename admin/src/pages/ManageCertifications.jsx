import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';

const ManageCertifications = () => {
  const { api } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', issuer: '', description: '', pdf: '', image: '', order: 0 });
  const [loading, setLoading] = useState(false);

  const fetchItems = () => { api.get('/certifications', { baseURL: (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://backend-pi-rosy-72.vercel.app/api') }).then(r => setItems(r.data)).catch(() => {}); };
  useEffect(() => { fetchItems(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  

  const handlePdfUpload = async (e) => {
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
      setForm({ ...form, pdf: `${import.meta.env.VITE_BACKEND_URL}${res.data.url}` });
      toast.success('PDF uploaded');
    } catch (err) {
      toast.error('Upload failed');
    }
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }
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

  const openNew = () => { setEditing(null); setForm({ title: '', issuer: '', description: '', pdf: '', image: '', order: 0 }); setShowModal(true); };
  const openEdit = (item) => { setEditing(item._id); setForm(item); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await api.put(`/certifications/${editing}`, form); else await api.post('/certifications', form);
      toast.success(editing ? 'Updated!' : 'Created!'); setShowModal(false); fetchItems();
    } catch { toast.error('Failed'); }
    setLoading(false);
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await api.delete(`/certifications/${id}`); toast.success('Deleted'); fetchItems(); } catch { toast.error('Failed'); } };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Certifications</h1><p className="page-subtitle">Manage your certifications</p></div>
        <button className="btn btn-primary" onClick={openNew}><HiPlus /> Add</button>
      </div>
      <div className="item-list">
        {items.map(item => (
          <div key={item._id} className="item-card">
            <div className="item-info"><h4>{item.title}</h4><p>{item.issuer}</p></div>
            <div className="item-actions">
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}><HiPencil /></button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}><HiTrash /></button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editing ? 'Edit' : 'Add'} Certification</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Title</label><input className="form-input" name="title" value={form.title} onChange={handleChange} required /></div>
              <div className="form-group"><label className="form-label">Issuer</label><input className="form-input" name="issuer" value={form.issuer} onChange={handleChange} required /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" name="description" value={form.description || ''} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">PDF Certificate (Optional)</label><input type="file" className="form-input" accept="application/pdf" onChange={handlePdfUpload} />{form.pdf && <div style={{marginTop: '10px'}}><a href={form.pdf} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary)', textDecoration: 'underline'}}>View Uploaded PDF</a></div>}</div>
              <div className="form-group"><label className="form-label">Image Preview (Optional)</label><input type="file" className="form-input" accept="image/*" onChange={handleImageUpload} />{form.image && <div style={{marginTop: '10px'}}><img src={form.image} alt="Preview" style={{maxHeight: '100px', borderRadius: '4px'}} /></div>}</div>
              <div className="form-group"><label className="form-label">Order</label><input className="form-input" type="number" name="order" value={form.order} onChange={handleChange} /></div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}><button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCertifications;
