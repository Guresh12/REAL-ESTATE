'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plot } from '@/lib/supabase/types'
import { MapPin, Ruler } from 'lucide-react'

interface PlotCardProps {
  plot: Plot
}

export default function PlotCard({ plot }: PlotCardProps) {
  const imageUrl = plot.images && plot.images.length > 0 
    ? plot.images[0] 
    : '/placeholder-plot.svg'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      {/* Plot Image */}
      <div className="relative h-64 w-full bg-gray-200">
        <Image
          src={imageUrl}
          alt={`Plot ${plot.plot_number}`}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-plot.svg'
          }}
        />
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              plot.status === 'available'
                ? 'bg-green-500 text-white'
                : plot.status === 'sold'
                ? 'bg-red-500 text-white'
                : 'bg-yellow-500 text-white'
            }`}
          >
            {plot.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Plot Details */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Plot {plot.plot_number}</h3>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{plot.location}</span>
          <span className="text-sm ml-2 text-gray-500">• {plot.area}</span>
        </div>

        {/* Plot Size */}
        <div className="flex items-center mb-4 text-gray-600">
          <Ruler size={16} className="mr-1" />
          <span className="text-sm">{plot.size} sqft</span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <p className="text-2xl font-bold text-primary-600">{formatPrice(plot.price)}</p>
        </div>

        {/* Action Button */}
        <Link
          href={`/schedule-visit?plot_id=${plot.id}`}
          className="btn-primary w-full text-center mt-4"
        >
          Schedule Site Visit
        </Link>
      </div>
    </div>
  )
}

