'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Mail, Phone, Calendar } from 'lucide-react'

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    const supabase = createSupabaseClient()

    // Get unique clients from site visits and receipts
    const [visitsResult, receiptsResult] = await Promise.all([
      supabase.from('site_visits').select('client_name, client_email, client_phone, created_at'),
      supabase.from('receipts').select('client_name, client_email, client_phone, created_at'),
    ])

    const clientsMap = new Map()

    // Add clients from site visits
    visitsResult.data?.forEach((visit) => {
      const key = visit.client_email.toLowerCase()
      if (!clientsMap.has(key)) {
        clientsMap.set(key, {
          name: visit.client_name,
          email: visit.client_email,
          phone: visit.client_phone,
          firstContact: visit.created_at,
          visits: 1,
          receipts: 0,
        })
      } else {
        const client = clientsMap.get(key)
        client.visits += 1
        if (new Date(visit.created_at) < new Date(client.firstContact)) {
          client.firstContact = visit.created_at
        }
      }
    })

    // Add clients from receipts
    receiptsResult.data?.forEach((receipt) => {
      const key = receipt.client_email.toLowerCase()
      if (!clientsMap.has(key)) {
        clientsMap.set(key, {
          name: receipt.client_name,
          email: receipt.client_email,
          phone: receipt.client_phone,
          firstContact: receipt.created_at,
          visits: 0,
          receipts: 1,
        })
      } else {
        const client = clientsMap.get(key)
        client.receipts += 1
        if (new Date(receipt.created_at) < new Date(client.firstContact)) {
          client.firstContact = receipt.created_at
        }
      }
    })

    setClients(Array.from(clientsMap.values()))
    setLoading(false)
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Clients Management</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Site Visits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Contact
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center space-x-1">
                      <Mail size={14} />
                      <span>{client.email}</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                      <Phone size={14} />
                      <span>{client.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.visits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.receipts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(client.firstContact).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No clients found.</p>
        </div>
      )}
    </div>
  )
}

