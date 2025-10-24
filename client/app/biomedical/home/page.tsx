'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, Wrench, Trash2 } from 'lucide-react'

export default function BiomedicalHome() {
  const router = useRouter()
  const [username, setUsername] = useState('')

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('biomedical_token')
    const user = localStorage.getItem('biomedical_user')

    if (!token || !user) {
      router.push('/biomedical/login')
      return
    }

    setUsername(user)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('biomedical_token')
    localStorage.removeItem('biomedical_user')
    router.push('/biomedical/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🏥 BioMedical Management System</h1>
            <p className="text-blue-100 mt-1">Equipment Maintenance & Waste Management</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, <span className="font-semibold">{username}</span></span>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Equipment Maintenance Card */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <Wrench className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl">Equipment Maintenance</CardTitle>
                  <CardDescription className="text-blue-100">Manage biomedical equipment</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-600">
                  Track and manage maintenance schedules for critical biomedical equipment including ventilators, ECG machines, infusion pumps, and more.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-gray-600">Features:</p>
                    <ul className="text-xs text-gray-700 mt-2 space-y-1">
                      <li>✓ Equipment Registration</li>
                      <li>✓ QR Code Tagging</li>
                      <li>✓ Service Logs</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-gray-600">More:</p>
                    <ul className="text-xs text-gray-700 mt-2 space-y-1">
                      <li>✓ Maintenance Alerts</li>
                      <li>✓ Dashboard Stats</li>
                      <li>✓ History Tracking</li>
                    </ul>
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/biomedical/equipment')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Go to Equipment Management
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Waste Management Card */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <Trash2 className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl">Waste Management</CardTitle>
                  <CardDescription className="text-green-100">Manage biomedical waste</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-600">
                  Segregate, track, and manage biomedical waste with color-coded categories and scheduled collection tasks.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-gray-600">Features:</p>
                    <ul className="text-xs text-gray-700 mt-2 space-y-1">
                      <li>✓ Color Segregation</li>
                      <li>✓ Daily Collection</li>
                      <li>✓ Waste Tracking</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-gray-600">More:</p>
                    <ul className="text-xs text-gray-700 mt-2 space-y-1">
                      <li>✓ Weekly Dispatch</li>
                      <li>✓ Dashboard Stats</li>
                      <li>✓ Reports</li>
                    </ul>
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/biomedical/waste')}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Go to Waste Management
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">7</p>
                <p className="text-sm text-gray-600 mt-2">Equipment Types</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">4</p>
                <p className="text-sm text-gray-600 mt-2">Waste Categories</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">2</p>
                <p className="text-sm text-gray-600 mt-2">Daily Collections</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">1</p>
                <p className="text-sm text-gray-600 mt-2">Weekly Dispatch</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

