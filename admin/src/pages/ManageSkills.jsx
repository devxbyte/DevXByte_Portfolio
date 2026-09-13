import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';

const ManageSkills = () => {
  const { api } = useAuth();
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ category: '', name: '', level: 50, order: 0 });
  const [loading, setLoading] = useState(false);

  const fetchSkills = () => { api.get('/skills', { baseURL: import.meta.env.VITE_API_URL }).then(res => setSkills(res.data)).catch(() => {}); };
  useEffect(() => { fetchSkills(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const openNew = () => { setEditing(null); setForm({ category: '', name: '', level: 50, order: 0 }); setShowModal(true); };
  const openEdit = (s) => { setEditing(s._id); setForm(s); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editing) await api.put(`/skills/${editing}`, form);
      else await api.post('/skills', form);
      toast.success(editing ? 'Updated!' : 'Created!'); setShowModal(false); fetchSkills();
    } catch { toast.error('Failed'); }
    setLoading(false);
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await api.delete(`/skills/${id}`); toast.success('Deleted'); fetchSkills(); } catch { toast.error('Failed'); } };

  const grouped = skills.reduce((a, s) => { if (!a[s.category]) a[s.category] = []; a[s.category].push(s); return a; }, {});

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Skills</h1><p className="page-subtitle">Manage your skills & technologies</p></div>
        <button className="btn btn-primary" onClick={openNew}><HiPlus /> Add Skill</button>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--accent)' }}>{cat}</h3>
          <div className="item-list">
            {items.map(s => (
              <div key={s._id} className="item-card">
                <div className="item-info">
                  <h4>{s.name}</h4>
                  <p>Level: {s.level}%</p>
                </div>
                <div className="item-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}><HiPencil /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}><HiTrash /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">{editing ? 'Edit' : 'Add'} Skill</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Category</label><input className="form-input" name="category" value={form.category} onChange={handleChange} required placeholder="e.g. Programming Languages" /></div>
              <div className="form-group"><label className="form-label">Skill Name</label><input className="form-input" name="name" value={form.name} onChange={handleChange} required /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Level (0-100)</label><input className="form-input" type="number" name="level" min="0" max="100" value={form.level} onChange={handleChange} /></div>
                <div className="form-group"><label className="form-label">Order</label><input className="form-input" type="number" name="order" value={form.order} onChange={handleChange} /></div>
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

export default ManageSkills;
