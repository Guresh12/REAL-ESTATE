'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Property, Plot } from '@/lib/supabase/types'

export default function ScheduleVisitPage() {
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('property_id')
  const plotId = searchParams.get('plot_id')
  
  const [property, setProperty] = useState<Property | null>(null)
  const [plot, setPlot] = useState<Plot | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    preferred_date: '',
    preferred_time: '',
    message: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createSupabaseClient()
      
      if (propertyId) {
        const { data } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single()
        if (data) setProperty(data)
      }

      if (plotId) {
        const { data } = await supabase
          .from('plots')
          .select('*')
          .eq('id', plotId)
          .single()
        if (data) setPlot(data)
      }
    }

    fetchData()
  }, [propertyId, plotId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createSupabaseClient()
      
      const { error: submitError } = await supabase
        .from('site_visits')
        .insert({
          property_id: propertyId || null,
          plot_id: plotId || null,
          client_name: formData.client_name,
          client_email: formData.client_email,
          client_phone: formData.client_phone,
          preferred_date: formData.preferred_date,
          preferred_time: formData.preferred_time,
          message: formData.message || null,
          status: 'pending',
        })

      if (submitError) throw submitError

      setSuccess(true)
      setFormData({
        client_name: '',
        client_email: '',
        client_phone: '',
        preferred_date: '',
        preferred_time: '',
        message: '',
      })
    } catch (err: any) {
      setError(err.message || 'Failed to submit site visit request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Site Visit</h1>
          <p className="text-gray-600 mb-8">
            Fill out the form below to schedule a visit to {property ? property.name : plot ? `Plot ${plot.plot_number}` : 'our properties'}
          </p>

          {property && (
            <div className="bg-primary-50 p-4 rounded-lg mb-6">
              <p className="font-semibold text-gray-900">Property: {property.name}</p>
              <p className="text-sm text-gray-600">{property.location}</p>
            </div>
          )}

          {plot && (
            <div className="bg-primary-50 p-4 rounded-lg mb-6">
              <p className="font-semibold text-gray-900">Plot: {plot.plot_number}</p>
              <p className="text-sm text-gray-600">{plot.location}, {plot.area}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">Request Submitted Successfully!</p>
              <p className="text-sm mt-1">We will contact you shortly to confirm your visit.</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="client_name" className="label">
                Full Name *
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
                Email Address *
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
                Phone Number *
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="preferred_date" className="label">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  id="preferred_date"
                  required
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.preferred_date}
                  onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="preferred_time" className="label">
                  Preferred Time *
                </label>
                <input
                  type="time"
                  id="preferred_time"
                  required
                  className="input"
                  value={formData.preferred_time}
                  onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="label">
                Message (Optional)
              </label>
              <textarea
                id="message"
                rows={4}
                className="input"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

