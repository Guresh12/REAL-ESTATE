'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Property, Plot } from '@/lib/supabase/types'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewReceiptPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [plots, setPlots] = useState<Plot[]>([])

  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    property_id: '',
    plot_id: '',
    amount: '',
    payment_method: 'cash',
    transaction_id: '',
    receipt_date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createSupabaseClient()
      const [propertiesResult, plotsResult] = await Promise.all([
        supabase.from('properties').select('*').order('name'),
        supabase.from('plots').select('*').order('plot_number'),
      ])

      if (propertiesResult.data) setProperties(propertiesResult.data)
      if (plotsResult.data) setPlots(plotsResult.data)
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createSupabaseClient()

      const receiptData = {
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        property_id: formData.property_id || null,
        plot_id: formData.plot_id || null,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        transaction_id: formData.transaction_id,
        receipt_date: formData.receipt_date,
      }

      const { error: insertError } = await supabase.from('receipts').insert(receiptData)

      if (insertError) throw insertError

      router.push('/admin/receipts')
    } catch (err: any) {
      setError(err.message || 'Failed to create receipt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/receipts"
          className="text-primary-600 hover:text-primary-800 flex items-center space-x-2 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Receipts</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Receipt</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="client_name" className="label">
              Client Name *
            </label>
            <input
              type="text"
              id="client_name"
              required
              className="input"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="client_email" className="label">
              Client Email *
            </label>
            <input
              type="email"
              id="client_email"
              required
              className="input"
              value={formData.client_email}
              onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="client_phone" className="label">
              Client Phone *
            </label>
            <input
              type="tel"
              id="client_phone"
              required
              className="input"
              value={formData.client_phone}
              onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="property_id" className="label">
              Property (Optional)
            </label>
            <select
              id="property_id"
              className="input"
              value={formData.property_id}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  property_id: e.target.value,
                  plot_id: '', // Clear plot if property is selected
                })
              }}
            >
              <option value="">Select Property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="plot_id" className="label">
              Plot (Optional)
            </label>
            <select
              id="plot_id"
              className="input"
              value={formData.plot_id}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  plot_id: e.target.value,
                  property_id: '', // Clear property if plot is selected
                })
              }}
            >
              <option value="">Select Plot</option>
              {plots.map((plot) => (
                <option key={plot.id} value={plot.id}>
                  Plot {plot.plot_number} - {plot.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="label">
              Amount (KES) *
            </label>
            <input
              type="number"
              id="amount"
              required
              className="input"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="payment_method" className="label">
              Payment Method *
            </label>
            <select
              id="payment_method"
              required
              className="input"
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="cheque">Cheque</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="transaction_id" className="label">
              Transaction ID *
            </label>
            <input
              type="text"
              id="transaction_id"
              required
              className="input"
              value={formData.transaction_id}
              onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
              placeholder="TXN-001234"
            />
          </div>

          <div>
            <label htmlFor="receipt_date" className="label">
              Receipt Date *
            </label>
            <input
              type="date"
              id="receipt_date"
              required
              className="input"
              value={formData.receipt_date}
              onChange={(e) => setFormData({ ...formData, receipt_date: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link href="/admin/receipts" className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2">
            <Save size={18} />
            <span>{loading ? 'Creating...' : 'Create Receipt'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

