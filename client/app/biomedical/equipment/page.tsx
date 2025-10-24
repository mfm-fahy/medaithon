'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, AlertCircle, CheckCircle, Clock, X, Wifi, WifiOff } from 'lucide-react'

interface Equipment {
  _id: string
  equipmentId: string
  name: string
  model: string
  serialNumber: string
  department: string
  status: string
  nextServiceDue: string
  lastServiceDate: string
}

export default function EquipmentManagement() {
  const router = useRouter()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, active: 0, dueSoon: 0, overdue: 0 })
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    serialNumber: '',
    department: '',
    purchaseDate: '',
    nextServiceDue: '',
    criticalityLevel: 'Medium'
  })
  const [submitting, setSubmitting] = useState(false)
  const [wsConnected, setWsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('biomedical_token')
    if (!token) {
      router.push('/biomedical/login')
      return
    }

    fetchEquipment()
    fetchStats()
    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [router])

  const connectWebSocket = () => {
    try {
      // Determine the correct WebSocket protocol and host
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
      const wsUrl = `${protocol}//${host}:5000?biomedicalUserId=biomedical_admin`

      console.log('🔌 Connecting to WebSocket:', wsUrl)
      console.log('📊 Connection details:', {
        protocol,
        host,
        port: 5000,
        userId: 'biomedical_admin',
        timestamp: new Date().toISOString()
      })

      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully')
        console.log('📊 Connection state:', ws.readyState)
        setWsConnected(true)
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)

          if (message.type === 'equipment-update') {
            console.log('📡 Equipment update received:', message.action)
            fetchEquipment()
            fetchStats()
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onclose = (event) => {
        console.log('❌ WebSocket disconnected')
        console.log('📊 Close details:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          timestamp: new Date().toISOString()
        })
        setWsConnected(false)
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000)
      }

      ws.onerror = (event) => {
        console.error('❌ WebSocket error occurred')
        console.error('📊 Error details:', {
          type: event.type,
          timestamp: new Date().toISOString(),
          readyState: ws.readyState,
          url: ws.url,
          error: event
        })
        // Log additional debugging info
        console.warn('⚠️ WebSocket connection failed. Possible causes:')
        console.warn('1. Server not running on port 5000')
        console.warn('2. Firewall or proxy blocking connection')
        console.warn('3. Network connectivity issue')
        console.warn('4. CORS or protocol mismatch')
        setWsConnected(false)
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Error connecting WebSocket:', error)
      console.error('📊 Exception details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      })
      setWsConnected(false)
    }
  }

  const fetchEquipment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/biomedical/equipment')
      const data = await response.json()
      setEquipment(data)
    } catch (error) {
      console.error('Error fetching equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/biomedical/equipment/dashboard/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'Due Soon':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'Overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Due Soon':
        return 'bg-yellow-100 text-yellow-800'
      case 'Overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch('http://localhost:5000/api/biomedical/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowModal(false)
        setFormData({
          name: '',
          model: '',
          serialNumber: '',
          department: '',
          purchaseDate: '',
          nextServiceDue: '',
          criticalityLevel: 'Medium'
        })
        fetchEquipment()
        fetchStats()
      } else {
        alert('Failed to add equipment')
      }
    } catch (error) {
      console.error('Error adding equipment:', error)
      alert('Error adding equipment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/biomedical/home')}
              variant="ghost"
              className="text-white hover:bg-blue-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">⚙️ Equipment Management</h1>
              <p className="text-blue-100">Track and manage biomedical equipment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-20 rounded-lg">
              {wsConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-white">Live Updates</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-300" />
                  <span className="text-sm text-white">Offline</span>
                </>
              )}
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-sm text-gray-600 mt-2">Total Equipment</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                <p className="text-sm text-gray-600 mt-2">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{stats.dueSoon}</p>
                <p className="text-sm text-gray-600 mt-2">Due Soon</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
                <p className="text-sm text-gray-600 mt-2">Overdue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equipment List */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment List</CardTitle>
            <CardDescription>All registered biomedical equipment</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading equipment...</p>
              </div>
            ) : equipment.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No equipment registered yet</p>
                <Button
                  onClick={() => setShowModal(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Equipment
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Equipment</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Model</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Next Service</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipment.map((item) => (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.serialNumber}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{item.model}</td>
                        <td className="py-3 px-4 text-gray-700">{item.department}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {new Date(item.nextServiceDue).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Equipment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
              <div>
                <CardTitle>Add New Equipment</CardTitle>
                <CardDescription>Register a new biomedical equipment</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddEquipment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Equipment Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Equipment Name *
                    </label>
                    <select
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Equipment</option>
                      <option value="Ventilator">Ventilator</option>
                      <option value="ECG Machine">ECG Machine</option>
                      <option value="Infusion Pump">Infusion Pump</option>
                      <option value="Defibrillator">Defibrillator</option>
                      <option value="Patient Monitor">Patient Monitor</option>
                      <option value="Suction Apparatus">Suction Apparatus</option>
                      <option value="X-Ray Machine">X-Ray Machine</option>
                    </select>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g., Model XYZ-100"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Serial Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Serial Number *
                    </label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., SN-12345"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="e.g., ICU, Emergency"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Purchase Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchase Date *
                    </label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Next Service Due */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Next Service Due *
                    </label>
                    <input
                      type="date"
                      name="nextServiceDue"
                      value={formData.nextServiceDue}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Criticality Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Criticality Level *
                    </label>
                    <select
                      name="criticalityLevel"
                      value={formData.criticalityLevel}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {submitting ? 'Adding...' : 'Add Equipment'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

