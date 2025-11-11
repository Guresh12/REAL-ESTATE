'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { SiteVisit } from '@/lib/supabase/types'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

export default function AdminSiteVisitsPage() {
  const [visits, setVisits] = useState<SiteVisit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    const supabase = createSupabaseClient()
    const { data } = await supabase
      .from('site_visits')
      .select('*, properties(name), plots(plot_number)')
      .order('created_at', { ascending: false })
    if (data) setVisits(data as any)
    setLoading(false)
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    const supabase = createSupabaseClient()
    const { error } = await supabase
      .from('site_visits')
      .update({ status: status as any })
      .eq('id', id)

    if (error) {
      alert('Failed to update status: ' + error.message)
    } else {
      fetchVisits()
    }
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Site Visit Requests</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property/Plot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preferred Date & Time
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
              {visits.map((visit: any) => (
                <tr key={visit.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{visit.client_name}</div>
                    <div className="text-sm text-gray-500">{visit.client_email}</div>
                    <div className="text-sm text-gray-500">{visit.client_phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {visit.properties?.name || `Plot ${visit.plots?.plot_number}` || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{new Date(visit.preferred_date).toLocaleDateString()}</div>
                    <div className="text-gray-500">{visit.preferred_time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        visit.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : visit.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : visit.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {visit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {visit.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(visit.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                        >
                          <CheckCircle size={18} />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(visit.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                        >
                          <XCircle size={18} />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                    {visit.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(visit.id, 'completed')}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <CheckCircle size={18} />
                        <span>Mark Complete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {visits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No site visit requests found.</p>
        </div>
      )}
    </div>
  )
}

