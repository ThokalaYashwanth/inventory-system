import { useState, useEffect } from 'react'
import { getOrders, getOrder, createOrder, deleteOrder, getProducts, getCustomers } from '../api/client'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [detailOrder, setDetailOrder] = useState(null)
  const [form, setForm] = useState({ customer_id: '', items: [{ product_id: '', quantity: 1 }] })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = () => getOrders().then(r => setOrders(r.data))
  useEffect(() => {
    load()
    getProducts().then(r => setProducts(r.data))
    getCustomers().then(r => setCustomers(r.data))
  }, [])

  const addItem = () => setForm({ ...form, items: [...form.items, { product_id: '', quantity: 1 }] })
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) })
  const updateItem = (i, field, val) => {
    const items = [...form.items]
    items[i] = { ...items[i], [field]: val }
    setForm({ ...form, items })
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.customer_id) return setError('Select a customer')
    if (form.items.some(i => !i.product_id || !i.quantity)) return setError('Fill all order items')
    try {
      await createOrder({
        customer_id: Number(form.customer_id),
        items: form.items.map(i => ({ product_id: Number(i.product_id), quantity: Number(i.quantity) }))
      })
      setSuccess('Order created!'); setShowModal(false); load()
      setForm({ customer_id: '', items: [{ product_id: '', quantity: 1 }] })
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) { setError(e.response?.data?.detail || 'Error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Cancel this order? Stock will be restored.')) return
    await deleteOrder(id); load()
  }

  const viewDetail = async (id) => {
    const r = await getOrder(id)
    setDetailOrder(r.data)
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <div className="page-title" style={{marginBottom:0}}>Orders</div>
        <button className="btn btn-primary" onClick={() => { setError(''); setShowModal(true) }}>+ New Order</button>
      </div>
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card">
        <table>
          <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={{fontFamily:'var(--font-mono)'}}>#ORD-{String(o.id).padStart(4,'0')}</td>
                <td>{customers.find(c=>c.id===o.customer_id)?.full_name || `Customer #${o.customer_id}`}</td>
                <td style={{fontWeight:700}}>${o.total_amount.toFixed(2)}</td>
                <td><span className="badge badge-ok">{o.status}</span></td>
                <td style={{fontSize:'0.8rem',color:'var(--muted)'}}>{new Date(o.created_at).toLocaleDateString()}</td>
                <td><div className="actions">
                  <button className="btn btn-sm btn-primary" onClick={() => viewDetail(o.id)}>View</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(o.id)}>Cancel</button>
                </div></td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={6} style={{textAlign:'center',color:'var(--muted)'}}>No orders yet</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Create Order</div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label>Customer</label>
              <select value={form.customer_id} onChange={e=>setForm({...form,customer_id:e.target.value})}>
                <option value="">Select customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </div>
            <label style={{marginBottom:'0.5rem',display:'block'}}>Items</label>
            {form.items.map((item, i) => (
              <div key={i} className="order-item-row">
                <select value={item.product_id} onChange={e=>updateItem(i,'product_id',e.target.value)}>
                  <option value="">Select product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price} · {p.quantity} left)</option>)}
                </select>
                <input type="number" min="1" value={item.quantity} onChange={e=>updateItem(i,'quantity',e.target.value)} style={{width:'70px'}} />
                {form.items.length > 1 && <button className="btn btn-sm btn-danger" onClick={() => removeItem(i)}>×</button>}
              </div>
            ))}
            <button className="btn" style={{background:'var(--surface2)',marginTop:'0.5rem'}} onClick={addItem}>+ Add Item</button>
            <div className="modal-actions">
              <button className="btn" style={{background:'var(--surface2)'}} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Place Order</button>
            </div>
          </div>
        </div>
      )}

      {detailOrder && (
        <div className="modal-overlay" onClick={() => setDetailOrder(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Order #ORD-{String(detailOrder.id).padStart(4,'0')}</div>
            <table>
              <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
              <tbody>
                {detailOrder.items.map(item => (
                  <tr key={item.id}>
                    <td>{products.find(p=>p.id===item.product_id)?.name || `Product #${item.product_id}`}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unit_price.toFixed(2)}</td>
                    <td>${(item.quantity * item.unit_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{textAlign:'right',marginTop:'1rem',fontWeight:700,fontSize:'1.1rem'}}>
              Total: ${detailOrder.total_amount.toFixed(2)}
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setDetailOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
