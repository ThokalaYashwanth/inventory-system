import { useState, useEffect } from 'react'
import { getCustomers, createCustomer, deleteCustomer } from '../api/client'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = () => getCustomers().then(r => setCustomers(r.data))
  useEffect(() => { load() }, [])

  const handleSubmit = async () => {
    setError('')
    if (!form.full_name || !form.email || !form.phone) return setError('All fields required')
    try {
      await createCustomer(form)
      setSuccess('Customer added!'); setShowModal(false); load()
      setForm({ full_name: '', email: '', phone: '' })
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) { setError(e.response?.data?.detail || 'Error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return
    await deleteCustomer(id); load()
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <div className="page-title" style={{marginBottom:0}}>Customers</div>
        <button className="btn btn-primary" onClick={() => { setError(''); setShowModal(true) }}>+ Add Customer</button>
      </div>
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>{c.full_name}</td>
                <td style={{fontFamily:'var(--font-mono)',fontSize:'0.85rem'}}>{c.email}</td>
                <td>{c.phone}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Delete</button></td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={4} style={{textAlign:'center',color:'var(--muted)'}}>No customers yet</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add Customer</div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group"><label>Full Name</label><input value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
            <div className="modal-actions">
              <button className="btn" style={{background:'var(--surface2)'}} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
