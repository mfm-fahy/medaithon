'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, CheckCircle, Clock, Truck, Wifi, WifiOff } from 'lucide-react'

interface CollectionTask {
  _id: string
  taskId: string
  date: string
  timeSlot: string
  assignedStaff: string
  location: string
  status: string
}

interface DispatchSchedule {
  _id: string
  dispatchId: string
  weekStartDate: string
  dispatchDate: string
  processingPlant: string
  status: string
}

export default function WasteManagement() {
  const router = useRouter()
  const [tasks, setTasks] = useState<CollectionTask[]>([])
  const [dispatch, setDispatch] = useState<DispatchSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalRecords: 0, totalQuantity: 0, breakdown: {} })
  const [wsConnected, setWsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('biomedical_token')
    if (!token) {
      router.push('/biomedical/login')
      return
    }

    fetchData()
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

          if (message.type === 'waste-update' || message.type === 'collection-task-update' || message.type === 'dispatch-update') {
            console.log('📡 Waste update received:', message.action)
            fetchData()
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
          message: event.message,
          timestamp: new Date().toISOString(),
          readyState: ws.readyState,
          url: ws.url
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

  const fetchData = async () => {
    try {
      const [tasksRes, dispatchRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/biomedical/collection-tasks'),
        fetch('http://localhost:5000/api/biomedical/dispatch'),
        fetch('http://localhost:5000/api/biomedical/waste/dashboard/stats'),
      ])

      const tasksData = await tasksRes.json()
      const dispatchData = await dispatchRes.json()
      const statsData = await statsRes.json()

      setTasks(tasksData)
      setDispatch(dispatchData)
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Scheduled':
        return 'bg-purple-100 text-purple-800'
      case 'In Transit':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'In Transit':
        return <Truck className="w-4 h-4 text-orange-600" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/biomedical/home')}
              variant="ghost"
              className="text-white hover:bg-green-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">♻️ Waste Management</h1>
              <p className="text-green-100">Track and manage biomedical waste</p>
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
            <Button className="bg-white text-green-600 hover:bg-green-50">
              <Plus className="w-4 h-4 mr-2" />
              Add Waste Record
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Waste Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">🟡</p>
                <p className="text-sm text-gray-600 mt-2">Yellow Waste</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{stats.breakdown?.yellow || 0} kg</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">🔴</p>
                <p className="text-sm text-gray-600 mt-2">Red Waste</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{stats.breakdown?.red || 0} kg</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">🔵</p>
                <p className="text-sm text-gray-600 mt-2">Blue Waste</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{stats.breakdown?.blue || 0} kg</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-600">⚪</p>
                <p className="text-sm text-gray-600 mt-2">White Waste</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{stats.breakdown?.white || 0} kg</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collection Tasks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Daily Collection Tasks</CardTitle>
            <CardDescription>Morning and evening waste collection schedule</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No collection tasks scheduled</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task) => (
                  <div key={task._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {task.timeSlot} Collection
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(task.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        <span className="font-semibold">Staff:</span> {task.assignedStaff}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Location:</span> {task.location}
                      </p>
                    </div>
                    {task.status !== 'Completed' && (
                      <Button
                        size="sm"
                        className="w-full mt-3 bg-green-600 hover:bg-green-700"
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Dispatch */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Dispatch Schedule</CardTitle>
            <CardDescription>Waste dispatch to processing plants</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading dispatch schedule...</p>
              </div>
            ) : dispatch.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No dispatch scheduled</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Dispatch ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Dispatch Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Processing Plant</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispatch.map((item) => (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm text-gray-700">{item.dispatchId}</td>
                        <td className="py-3 px-4 text-gray-700">
                          {new Date(item.dispatchDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-gray-700">{item.processingPlant}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
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
    </div>
  )
}

