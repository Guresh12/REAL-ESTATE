import Navbar from '@/components/Navbar'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/lib/supabase/types'

export default async function PropertiesPage() {
  const supabase = createSupabaseServerClient()
  
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  // Group properties by area
  const propertiesByArea = properties?.reduce((acc: Record<string, Property[]>, property: Property) => {
    const area = property.area || 'Other'
    if (!acc[area]) {
      acc[area] = []
    }
    acc[area].push(property)
    return acc
  }, {} as Record<string, Property[]>) || {}

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Properties</h1>
          <p className="text-gray-600">Browse our complete collection of properties</p>
        </div>

        {Object.keys(propertiesByArea).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(propertiesByArea).map(([area, areaProperties]) => (
              <div key={area}>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">{area}</h2>
                  <p className="text-gray-600">
                    {areaProperties.length} {areaProperties.length === 1 ? 'property' : 'properties'} available
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {areaProperties.map((property: Property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No properties available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

