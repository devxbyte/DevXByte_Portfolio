import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ManageAbout = () => {
  const { api } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', image: '', highlights: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/about', { baseURL: (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://backend-pi-rosy-72.vercel.app/api') })
      .then(res => { if (res.data && res.data.title) setForm(res.data); })
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleHighlight = (index, field, value) => {
    const updated = [...form.highlights];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, highlights: updated });
  };

  const addHighlight = () => setForm({ ...form, highlights: [...form.highlights, { label: '', value: '' }] });
  const removeHighlight = (i) => setForm({ ...form, highlights: form.highlights.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.put('/about', form); toast.success('About updated! ✨'); }
    catch { toast.error('Failed to update'); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">About Section</h1><p className="page-subtitle">Edit your about section</p></div>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" name="title" value={form.title} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} rows={6} />
          </div>
          <div className="form-section-title">Highlights</div>
          {form.highlights.map((h, i) => (
            <div key={i} className="form-row" style={{ marginBottom: '8px' }}>
              <input className="form-input" placeholder="Label" value={h.label} onChange={e => handleHighlight(i, 'label', e.target.value)} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input className="form-input" placeholder="Value" value={h.value} onChange={e => handleHighlight(i, 'value', e.target.value)} />
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeHighlight(i)}>×</button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline" onClick={addHighlight} style={{ marginBottom: '16px' }}>+ Add Highlight</button>
          <br />
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
};

export default ManageAbout;
