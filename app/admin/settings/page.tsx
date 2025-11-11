'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/supabase/types'
import { Save, CheckCircle, XCircle } from 'lucide-react'

export default function AdminSettingsPage() {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    email: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createSupabaseClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profile) {
          setUser(profile)
          setProfileData({
            name: profile.name || '',
            phone: profile.phone || '',
            email: profile.email || authUser.email || '',
          })
        }
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(null)
    setError(null)

    try {
      const supabase = createSupabaseClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) throw new Error('Not authenticated')

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone,
        })
        .eq('id', authUser.id)

      if (profileError) throw profileError

      // Update email if changed
      if (profileData.email !== authUser.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileData.email,
        })

        if (emailError) throw emailError
      }

      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
      setTimeout(() => setError(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(null)
    setError(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      setTimeout(() => setError(null), 5000)
      setSaving(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setTimeout(() => setError(null), 5000)
      setSaving(false)
      return
    }

    try {
      const supabase = createSupabaseClient()
      
      // Update password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (passwordError) throw passwordError

      setSuccess('Password updated successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
      setError(err.message || 'Failed to update password')
      setTimeout(() => setError(null), 5000)
    } finally {
      setSaving(false)
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center">
          <CheckCircle size={20} className="mr-2" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center">
          <XCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="input"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="input"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="input"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Role</label>
              <input
                type="text"
                className="input bg-gray-100"
                value={user?.role || 'user'}
                disabled
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Save size={18} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="label">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                className="input"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="label">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="input"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="input"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Save size={18} />
              <span>{saving ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

