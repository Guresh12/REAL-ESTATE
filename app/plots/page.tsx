import Navbar from '@/components/Navbar'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import PlotCard from '@/components/PlotCard'
import { Plot } from '@/lib/supabase/types'

export default async function PlotsPage() {
  const supabase = createSupabaseServerClient()
  
  const { data: plots } = await supabase
    .from('plots')
    .select('*')
    .order('created_at', { ascending: false })

  // Group plots by area and status
  const availablePlots = plots?.filter((plot: Plot) => plot.status === 'available') || []
  const soldPlots = plots?.filter((plot: Plot) => plot.status === 'sold') || []
  const reservedPlots = plots?.filter((plot: Plot) => plot.status === 'reserved') || []

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Plots</h1>
          <p className="text-gray-600">Browse our selection of premium plots</p>
        </div>

        {/* Available Plots */}
        {availablePlots.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Available Plots</h2>
              <p className="text-gray-600">
                {availablePlots.length} {availablePlots.length === 1 ? 'plot' : 'plots'} available
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePlots.map((plot: Plot) => (
                <PlotCard key={plot.id} plot={plot} />
              ))}
            </div>
          </div>
        )}

        {/* Reserved Plots */}
        {reservedPlots.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Reserved Plots</h2>
              <p className="text-gray-600">
                {reservedPlots.length} {reservedPlots.length === 1 ? 'plot' : 'plots'} reserved
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reservedPlots.map((plot: Plot) => (
                <PlotCard key={plot.id} plot={plot} />
              ))}
            </div>
          </div>
        )}

        {/* Sold Plots */}
        {soldPlots.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Sold Plots</h2>
              <p className="text-gray-600">
                {soldPlots.length} {soldPlots.length === 1 ? 'plot' : 'plots'} sold
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {soldPlots.map((plot: Plot) => (
                <PlotCard key={plot.id} plot={plot} />
              ))}
            </div>
          </div>
        )}

        {plots?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No plots available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

