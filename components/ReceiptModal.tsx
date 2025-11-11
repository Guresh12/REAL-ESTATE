'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Receipt } from '@/lib/supabase/types'
import { Download, Printer, X } from 'lucide-react'

interface ReceiptModalProps {
  receipt: Receipt | null
  isOpen: boolean
  onClose: () => void
  companyInfo?: {
    name: string
    contact: string
    address: string
  }
}

export default function ReceiptModal({
  receipt,
  isOpen,
  onClose,
  companyInfo = {
    name: 'Elite Properties',
    contact: '+254 700 000 000',
    address: 'Nairobi, Kenya',
  },
}: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !receipt) return null

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`receipt-${receipt.transaction_id}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header with actions */}
          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b">
            <h3 className="text-lg font-semibold text-gray-900">Receipt</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                title="Download PDF"
              >
                <Download size={20} />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-lg transition-colors"
                title="Print Receipt"
              >
                <Printer size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Receipt content */}
          <div className="bg-white p-8">
            <div ref={receiptRef} className="max-w-2xl mx-auto bg-white p-8">
              {/* Company Logo and Info */}
              <div className="text-center mb-8">
                <div className="relative h-20 w-20 mx-auto mb-4">
                  <Image
                    src="/logo.png"
                    alt={companyInfo.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{companyInfo.name}</h1>
                <p className="text-gray-600">{companyInfo.contact}</p>
                <p className="text-gray-600">{companyInfo.address}</p>
              </div>

              <div className="border-t-2 border-b-2 border-gray-300 py-4 my-6">
                <h2 className="text-xl font-bold text-center text-gray-900">PAYMENT RECEIPT</h2>
              </div>

              {/* Receipt Details */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-600">Receipt Number:</span>
                  <span className="font-semibold">{receipt.transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{formatDate(receipt.receipt_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold">{receipt.payment_method}</span>
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Client Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name: </span>
                    <span className="font-medium">{receipt.client_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email: </span>
                    <span className="font-medium">{receipt.client_email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone: </span>
                    <span className="font-medium">{receipt.client_phone}</span>
                  </div>
                </div>
              </div>

              {/* Payment Amount */}
              <div className="border-t-2 border-gray-300 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(receipt.amount)}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                <p>Thank you for your business!</p>
                <p className="mt-2">This is a computer-generated receipt.</p>
              </div>
            </div>
          </div>

          {/* Action buttons (visible on screen, hidden in print) */}
          <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3 border-t print:hidden">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Download size={18} />
              <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
            </button>
            <button onClick={handlePrint} className="btn-secondary flex items-center space-x-2">
              <Printer size={18} />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-content,
          .receipt-content * {
            visibility: visible;
          }
          .receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

