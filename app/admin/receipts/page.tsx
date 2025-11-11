'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Receipt } from '@/lib/supabase/types'
import ReceiptModal from '@/components/ReceiptModal'
import { Plus, Eye } from 'lucide-react'

export default function AdminReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchReceipts()
  }, [])

  const fetchReceipts = async () => {
    const supabase = createSupabaseClient()
    const { data } = await supabase
      .from('receipts')
      .select('*, properties(name), plots(plot_number)')
      .order('created_at', { ascending: false })
    if (data) setReceipts(data as any)
    setLoading(false)
  }

  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt)
    setIsModalOpen(true)
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).format(amount)
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
        <h1 className="text-3xl font-bold text-gray-900">Receipts Management</h1>
        <Link href="/admin/receipts/new" className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Create Receipt</span>
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property/Plot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {receipts.map((receipt: any) => (
                <tr key={receipt.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {receipt.transaction_id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{receipt.client_name}</div>
                    <div className="text-sm text-gray-500">{receipt.client_email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {receipt.properties?.name || `Plot ${receipt.plots?.plot_number}` || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPrice(receipt.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(receipt.receipt_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewReceipt(receipt)}
                      className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                    >
                      <Eye size={18} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {receipts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No receipts found.</p>
          <Link href="/admin/receipts/new" className="btn-primary mt-4 inline-block">
            Create Your First Receipt
          </Link>
        </div>
      )}

      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedReceipt(null)
        }}
      />
    </div>
  )
}

