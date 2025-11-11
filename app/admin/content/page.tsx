'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'
import { WebsiteContent } from '@/lib/supabase/types'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

export default function AdminContentPage() {
  const [content, setContent] = useState<WebsiteContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    const supabase = createSupabaseClient()
    const { data } = await supabase
      .from('website_content')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setContent(data)
    setLoading(false)
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    const supabase = createSupabaseClient()
    const { error } = await supabase
      .from('website_content')
      .update({ is_active: !isActive })
      .eq('id', id)

    if (error) {
      alert('Failed to update content: ' + error.message)
    } else {
      fetchContent()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    const supabase = createSupabaseClient()
    const { error } = await supabase.from('website_content').delete().eq('id', id)

    if (error) {
      alert('Failed to delete content: ' + error.message)
    } else {
      fetchContent()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Website Content Management</h1>
        <Link href="/admin/content/new" className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Content</span>
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {content.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {item.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.title || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                    {item.content || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(item.id, item.is_active)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      {item.is_active ? (
                        <ToggleRight size={24} className="text-green-600" />
                      ) : (
                        <ToggleLeft size={24} className="text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/content/${item.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={18} className="inline" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {content.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No content found.</p>
          <Link href="/admin/content/new" className="btn-primary mt-4 inline-block">
            Add Your First Content
          </Link>
        </div>
      )}
    </div>
  )
}

