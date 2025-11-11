'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/lib/supabase/types'
import { MapPin, Bed, Bath, Square } from 'lucide-react'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.images && property.images.length > 0 
    ? property.images[0] 
    : '/placeholder-property.svg'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="card hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Property Image */}
        <div className="relative h-64 w-full bg-gray-200">
          <Image
            src={imageUrl}
            alt={property.name}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-property.svg'
            }}
          />
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
        </div>

        {/* Property Details */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h3>
          
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">{property.location}</span>
            {property.area && (
              <span className="text-sm ml-2 text-gray-500">• {property.area}</span>
            )}
          </div>

          {/* Property Features */}
          <div className="flex items-center space-x-4 mb-4 text-gray-600">
            {property.bedrooms && (
              <div className="flex items-center">
                <Bed size={16} className="mr-1" />
                <span className="text-sm">{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath size={16} className="mr-1" />
                <span className="text-sm">{property.bathrooms}</span>
              </div>
            )}
            {property.sqft && (
              <div className="flex items-center">
                <Square size={16} className="mr-1" />
                <span className="text-sm">{property.sqft} sqft</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <p className="text-2xl font-bold text-primary-600">{formatPrice(property.price)}</p>
            <p className="text-sm text-gray-500 mt-1">{property.type}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

