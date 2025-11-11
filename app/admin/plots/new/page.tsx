'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPlotPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    plot_number: '',
    area: '',
    size: '',
    price: '',
    location: '',
    status: 'available' as 'available' | 'sold' | 'reserved',
    description: '',
    images: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createSupabaseClient()

      const plotData = {
        plot_number: formData.plot_number,
        area: formData.area,
        size: parseFloat(formData.size),
        price: parseFloat(formData.price),
        location: formData.location,
        status: formData.status,
        description: formData.description || null,
        images: formData.images.length > 0 ? formData.images : null,
      }

      const { error: insertError } = await supabase.from('plots').insert(plotData)

      if (insertError) throw insertError

      router.push('/admin/plots')
    } catch (err: any) {
      setError(err.message || 'Failed to create plot')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/plots"
          className="text-primary-600 hover:text-primary-800 flex items-center space-x-2 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Plots</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Plot</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="plot_number" className="label">
              Plot Number *
            </label>
            <input
              type="text"
              id="plot_number"
              required
              className="input"
              value={formData.plot_number}
              onChange={(e) => setFormData({ ...formData, plot_number: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="status" className="label">
              Status *
            </label>
            <select
              id="status"
              required
              className="input"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="label">
              Location *
            </label>
            <input
              type="text"
              id="location"
              required
              className="input"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="area" className="label">
              Area *
            </label>
            <input
              type="text"
              id="area"
              required
              className="input"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="size" className="label">
              Size (sqft) *
            </label>
            <input
              type="number"
              id="size"
              required
              className="input"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="price" className="label">
              Price (KES) *
            </label>
            <input
              type="number"
              id="price"
              required
              className="input"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="input"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="images" className="label">
            Image URLs (one per line)
          </label>
          <textarea
            id="images"
            rows={4}
            className="input"
            value={formData.images.join('\n')}
            onChange={(e) =>
              setFormData({
                ...formData,
                images: e.target.value.split('\n').filter((url) => url.trim()),
              })
            }
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Link href="/admin/plots" className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2">
            <Save size={18} />
            <span>{loading ? 'Saving...' : 'Save Plot'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

