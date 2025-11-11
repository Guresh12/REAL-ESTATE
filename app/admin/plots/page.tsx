'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Plot } from '@/lib/supabase/types'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function AdminPlotsPage() {
  const [plots, setPlots] = useState<Plot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlots()
  }, [])

  const fetchPlots = async () => {
    const supabase = createSupabaseClient()
    const { data } = await supabase.from('plots').select('*').order('created_at', { ascending: false })
    if (data) setPlots(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plot?')) return

    const supabase = createSupabaseClient()
    const { error } = await supabase.from('plots').delete().eq('id', id)

    if (error) {
      alert('Failed to delete plot: ' + error.message)
    } else {
      fetchPlots()
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
        <h1 className="text-3xl font-bold text-gray-900">Plots Management</h1>
        <Link href="/admin/plots/new" className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Plot</span>
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plot Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size (sqft)
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
              {plots.map((plot) => (
                <tr key={plot.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {plot.plot_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plot.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plot.area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plot.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(plot.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        plot.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : plot.status === 'sold'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {plot.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/plots/${plot.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={18} className="inline" />
                    </Link>
                    <button
                      onClick={() => handleDelete(plot.id)}
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

      {plots.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No plots found.</p>
          <Link href="/admin/plots/new" className="btn-primary mt-4 inline-block">
            Add Your First Plot
          </Link>
        </div>
      )}
    </div>
  )
}

