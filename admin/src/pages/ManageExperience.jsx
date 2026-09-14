import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';

const ManageExperience = () => {
  const { api } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ company: '', role: '', location: '', startDate: '', endDate: 'Present', description: '', order: 0 });
  const [loading, setLoading] = useState(false);

  const fetchItems = () => { api.get('/experience', { baseURL: (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://backend-pi-rosy-72.vercel.app/api') }).then(r => setItems(r.data)).catch(() => {}); };
  useEffect(() => { fetchItems(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const openNew = () => { setEditing(null); setForm({ company: '', role: '', location: '', startDate: '', endDate: 'Present', description: '', order: 0 }); setShowModal(true); };
  const openEdit = (item) => { setEditing(item._id); setForm(item); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await api.put(`/experience/${editing}`, form); else await api.post('/experience', form);
      toast.success(editing ? 'Updated!' : 'Created!'); setShowModal(false); fetchItems();
    } catch { toast.error('Failed'); }
    setLoading(false);
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await api.delete(`/experience/${id}`); toast.success('Deleted'); fetchItems(); } catch { toast.error('Failed'); } };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Experience</h1><p className="page-subtitle">Manage your work experience</p></div>
        <button className="btn btn-primary" onClick={openNew}><HiPlus /> Add</button>
      </div>
      <div className="item-list">
        {items.map(item => (
          <div key={item._id} className="item-card">
            <div className="item-info"><h4>{item.company}</h4><p>{item.role} • {item.startDate} - {item.endDate}</p></div>
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
            <h2 className="modal-title">{editing ? 'Edit' : 'Add'} Experience</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row"><div className="form-group"><label className="form-label">Company</label><input className="form-input" name="company" value={form.company} onChange={handleChange} required /></div><div className="form-group"><label className="form-label">Role</label><input className="form-input" name="role" value={form.role} onChange={handleChange} required /></div></div>
              <div className="form-row"><div className="form-group"><label className="form-label">Location</label><input className="form-input" name="location" value={form.location || ''} onChange={handleChange} /></div><div className="form-group"><label className="form-label">Order</label><input className="form-input" type="number" name="order" value={form.order} onChange={handleChange} /></div></div>
              <div className="form-row"><div className="form-group"><label className="form-label">Start Date</label><input className="form-input" name="startDate" value={form.startDate} onChange={handleChange} required /></div><div className="form-group"><label className="form-label">End Date</label><input className="form-input" name="endDate" value={form.endDate} onChange={handleChange} /></div></div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" name="description" value={form.description || ''} onChange={handleChange} /></div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}><button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button><button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageExperience;
