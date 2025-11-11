import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/lib/supabase/types'

export default async function HomePage() {
  const supabase = createSupabaseServerClient()
  
  // Fetch featured properties
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'available')
    .limit(6)
    .order('created_at', { ascending: false })

  // Fetch company info
  const { data: companyInfo } = await supabase
    .from('website_content')
    .select('*')
    .eq('type', 'company_info')
    .eq('is_active', true)
    .single()

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Elite Properties
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Your Trusted Real Estate Partner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Browse Properties
              </Link>
              <Link href="/plots" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
                View Plots
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-gray-600">Discover our premium selection of properties</p>
          </div>

          {properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property: Property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No properties available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/properties" className="btn-primary">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Elite Properties?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="p-6">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2">Premium Properties</h3>
                <p className="text-gray-600">
                  Handpicked selection of the finest properties in prime locations
                </p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-2">Expert Service</h3>
                <p className="text-gray-600">
                  Professional team dedicated to making your real estate journey seamless
                </p>
              </div>
              <div className="p-6">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-2">Transparent Process</h3>
                <p className="text-gray-600">
                  Clear communication and honest dealings throughout your purchase
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Schedule a site visit today and experience our properties firsthand
          </p>
          <Link href="/schedule-visit" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Schedule Site Visit
          </Link>
        </div>
      </section>
    </div>
  )
}

