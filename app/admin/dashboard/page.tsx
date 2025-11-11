import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Building, MapPin, Calendar, Receipt, Users, TrendingUp } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient()

  // Fetch statistics
  const [propertiesResult, plotsResult, siteVisitsResult, receiptsResult] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact' }),
    supabase.from('plots').select('id', { count: 'exact' }),
    supabase.from('site_visits').select('id', { count: 'exact' }),
    supabase.from('receipts').select('id', { count: 'exact' }),
  ])

  const propertiesCount = propertiesResult.count || 0
  const plotsCount = plotsResult.count || 0
  const siteVisitsCount = siteVisitsResult.count || 0
  const receiptsCount = receiptsResult.count || 0

  // Fetch recent site visits
  const { data: recentVisits } = await supabase
    .from('site_visits')
    .select('*, properties(name), plots(plot_number)')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    {
      name: 'Total Properties',
      value: propertiesCount,
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total Plots',
      value: plotsCount,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Site Visits',
      value: siteVisitsCount,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Total Receipts',
      value: receiptsCount,
      icon: Receipt,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`${stat.color} w-6 h-6`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Site Visits */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Site Visit Requests</h2>
        {recentVisits && recentVisits.length > 0 ? (
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
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentVisits.map((visit: any) => (
                  <tr key={visit.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{visit.client_name}</div>
                      <div className="text-sm text-gray-500">{visit.client_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visit.properties?.name || `Plot ${visit.plots?.plot_number}` || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(visit.preferred_date).toLocaleDateString()} at {visit.preferred_time}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No recent site visit requests.</p>
        )}
      </div>
    </div>
  )
}

