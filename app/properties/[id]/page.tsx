import Navbar from '@/components/Navbar'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Bed, Bath, Square, ExternalLink } from 'lucide-react'
import { notFound } from 'next/navigation'

interface PropertyDetailPageProps {
  params: {
    id: string
  }
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const supabase = createSupabaseServerClient()
  
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!property) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['/placeholder-property.svg']

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Property Images */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-96 w-full bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={images[0]}
                alt={property.name}
                fill
                className="object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative h-44 w-full bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${property.name} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{property.name}</h1>
            
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin size={20} className="mr-2" />
              <span>{property.location}</span>
              {property.area && (
                <span className="ml-2 text-gray-500">• {property.area}</span>
              )}
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  property.status === 'available'
                    ? 'bg-green-500 text-white'
                    : property.status === 'sold'
                    ? 'bg-red-500 text-white'
                    : 'bg-yellow-500 text-white'
                }`}
              >
                {property.status.toUpperCase()}
              </span>
            </div>

            {/* Property Features */}
            <div className="flex items-center space-x-6 mb-8 text-gray-700">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed size={20} className="mr-2" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath size={20} className="mr-2" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
              )}
              {property.sqft && (
                <div className="flex items-center">
                  <Square size={20} className="mr-2" />
                  <span>{property.sqft} sqft</span>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* Virtual Tour */}
            {property.virtual_tour_url && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Virtual Tour</h2>
                <Link
                  href={property.virtual_tour_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <span>Take a Virtual Tour</span>
                  <ExternalLink size={18} />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <div className="mb-6">
                <p className="text-3xl font-bold text-primary-600 mb-2">
                  {formatPrice(property.price)}
                </p>
                <p className="text-gray-600 capitalize">{property.type}</p>
              </div>

              <div className="space-y-4">
                <Link
                  href={`/schedule-visit?property_id=${property.id}`}
                  className="btn-primary w-full text-center block"
                >
                  Schedule Site Visit
                </Link>
                <button className="btn-secondary w-full">
                  Contact Agent
                </button>
              </div>

              {/* Property Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium capitalize">{property.status}</span>
                  </div>
                  {property.bedrooms && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                  )}
                  {property.sqft && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-medium">{property.sqft} sqft</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

