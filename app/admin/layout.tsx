'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createSupabaseClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Home,
  Building,
  MapPin,
  Calendar,
  Receipt,
  Settings,
  FileText,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin/login')
        return
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut()
        router.push('/admin/login')
        return
      }

      setUser(profile)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/properties', label: 'Properties', icon: Building },
    { href: '/admin/plots', label: 'Plots', icon: MapPin },
    { href: '/admin/site-visits', label: 'Site Visits', icon: Calendar },
    { href: '/admin/receipts', label: 'Receipts', icon: Receipt },
    { href: '/admin/clients', label: 'Clients', icon: Home },
    { href: '/admin/content', label: 'Website Content', icon: FileText },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="relative h-8 w-8">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold">Elite Properties</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                  isActive(item.href) ? 'bg-gray-800 text-white border-r-2 border-primary-500' : ''
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors rounded-lg"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-4 ml-auto">
              <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

