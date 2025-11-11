'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    area: '',
    type: 'apartment' as 'apartment' | 'house' | 'commercial' | 'land',
    status: 'available' as 'available' | 'sold' | 'reserved',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    virtual_tour_url: '',
    images: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createSupabaseClient()

      const propertyData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        location: formData.location,
        area: formData.area || null,
        type: formData.type,
        status: formData.status,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        sqft: formData.sqft ? parseInt(formData.sqft) : null,
        virtual_tour_url: formData.virtual_tour_url || null,
        images: formData.images.length > 0 ? formData.images : null,
      }

      const { error: insertError } = await supabase
        .from('properties')
        .insert(propertyData)

      if (insertError) throw insertError

      router.push('/admin/properties')
    } catch (err: any) {
      setError(err.message || 'Failed to create property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/properties"
          className="text-primary-600 hover:text-primary-800 flex items-center space-x-2 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Properties</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="label">
              Property Name *
            </label>
            <input
              type="text"
              id="name"
              required
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="type" className="label">
              Property Type *
            </label>
            <select
              id="type"
              required
              className="input"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
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
              Area
            </label>
            <input
              type="text"
              id="area"
              className="input"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="bedrooms" className="label">
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              className="input"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              min="0"
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className="label">
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              className="input"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              min="0"
            />
          </div>

          <div>
            <label htmlFor="sqft" className="label">
              Square Feet
            </label>
            <input
              type="number"
              id="sqft"
              className="input"
              value={formData.sqft}
              onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
              min="0"
            />
          </div>

          <div>
            <label htmlFor="virtual_tour_url" className="label">
              Virtual Tour URL
            </label>
            <input
              type="url"
              id="virtual_tour_url"
              className="input"
              value={formData.virtual_tour_url}
              onChange={(e) => setFormData({ ...formData, virtual_tour_url: e.target.value })}
              placeholder="https://virtual.amccopropertiesltd.co.ke/..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            rows={6}
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
          <p className="text-xs text-gray-500 mt-1">
            Enter image URLs, one per line. You can upload images to Supabase Storage and use those URLs.
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <Link href="/admin/properties" className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2">
            <Save size={18} />
            <span>{loading ? 'Saving...' : 'Save Property'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

