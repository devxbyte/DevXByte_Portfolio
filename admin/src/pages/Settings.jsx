import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { api } = useAuth();
  const [form, setForm] = useState({ siteTitle: '', metaDescription: '', analyticsId: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/settings', { baseURL: (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://backend-pi-rosy-72.vercel.app/api') })
      .then(r => { if (r.data && r.data.siteTitle) setForm(r.data); }).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await api.put('/settings', form); toast.success('Settings saved!'); }
    catch { toast.error('Failed'); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Settings</h1><p className="page-subtitle">Site configuration</p></div>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Site Title</label><input className="form-input" name="siteTitle" value={form.siteTitle} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">Meta Description</label><textarea className="form-textarea" name="metaDescription" value={form.metaDescription || ''} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">Google Analytics ID</label><input className="form-input" name="analyticsId" value={form.analyticsId || ''} onChange={handleChange} placeholder="GA-XXXXXXXXXX" /></div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '8px' }}>{loading ? 'Saving...' : 'Save Settings'}</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
