import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/client'

export default function Products() {
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', sku: '', price: '', quantity: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = () => getProducts().then(r => setProducts(r.data))
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm({ name: '', sku: '', price: '', quantity: '' }); setError(''); setShowModal(true) }
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, sku: p.sku, price: p.price, quantity: p.quantity }); setError(''); setShowModal(true) }

  const handleSubmit = async () => {
    setError('')
    if (!form.name || !form.sku || form.price === '' || form.quantity === '') return setError('All fields required')
    if (Number(form.quantity) < 0) return setError('Quantity cannot be negative')
    try {
      const data = { name: form.name, sku: form.sku, price: Number(form.price), quantity: Number(form.quantity) }
      editing ? await updateProduct(editing.id, data) : await createProduct(data)
      setSuccess(editing ? 'Product updated!' : 'Product created!')
      setShowModal(false); load()
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError(e.response?.data?.detail || 'Error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await deleteProduct(id); load()
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <div className="page-title" style={{marginBottom:0}}>Products</div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td style={{fontFamily:'var(--font-mono)',fontSize:'0.8rem'}}>{p.sku}</td>
                <td>${p.price.toFixed(2)}</td>
                <td><span className={`badge ${p.quantity <= 5 ? 'badge-low' : 'badge-ok'}`}>{p.quantity}</span></td>
                <td><div className="actions">
                  <button className="btn btn-sm btn-primary" onClick={() => openEdit(p)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </div></td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={5} style={{textAlign:'center',color:'var(--muted)'}}>No products yet</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editing ? 'Edit Product' : 'Add Product'}</div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group"><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="form-row">
              <div className="form-group"><label>SKU</label><input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} /></div>
              <div className="form-group"><label>Price ($)</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} /></div>
            </div>
            <div className="form-group"><label>Quantity</label><input type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} /></div>
            <div className="modal-actions">
              <button className="btn" style={{background:'var(--surface2)'}} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>{editing ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
