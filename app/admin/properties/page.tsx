'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Property } from '@/lib/supabase/types'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    const supabase = createSupabaseClient()
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
    if (data) setProperties(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    const supabase = createSupabaseClient()
    const { error } = await supabase.from('properties').delete().eq('id', id)

    if (error) {
      alert('Failed to delete property: ' + error.message)
    } else {
      fetchProperties()
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
        <Link href="/admin/properties/new" className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Property</span>
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{property.name}</div>
                    {property.area && (
                      <div className="text-sm text-gray-500">{property.area}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {property.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {property.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(property.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'sold'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/properties/${property.id}`}
                      target="_blank"
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Eye size={18} className="inline" />
                    </Link>
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={18} className="inline" />
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No properties found.</p>
          <Link href="/admin/properties/new" className="btn-primary mt-4 inline-block">
            Add Your First Property
          </Link>
        </div>
      )}
    </div>
  )
}

