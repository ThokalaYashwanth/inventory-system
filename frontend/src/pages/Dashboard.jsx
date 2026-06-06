import { useState, useEffect } from 'react'
import { getDashboard } from '../api/client'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then(r => { setData(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="page-title">Loading...</div>
  if (!data) return <div className="page-title">Could not load dashboard</div>

  return (
    <div>
      <div className="page-title">Dashboard</div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{data.total_products}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Customers</div>
          <div className="stat-value">{data.total_customers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{data.total_orders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low Stock Items</div>
          <div className="stat-value" style={{color: data.low_stock_products.length > 0 ? 'var(--danger)' : 'var(--success)'}}>
            {data.low_stock_products.length}
          </div>
        </div>
      </div>

      {data.low_stock_products.length > 0 && (
        <div className="card">
          <h3 style={{marginBottom: '1rem', fontWeight: 700}}>⚠️ Low Stock Alert</h3>
          <table>
            <thead>
              <tr><th>Product</th><th>Quantity</th></tr>
            </thead>
            <tbody>
              {data.low_stock_products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td><span className="badge badge-low">{p.quantity} left</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
