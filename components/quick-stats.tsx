"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingUp, TrendingDown, Users, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function QuickStats() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const { toast } = useToast()

  // Mock real-time stats that update periodically
  const [stats, setStats] = useState({
    activeUsers: 1247,
    todayEvents: 3,
    liveAttendance: 89,
    systemHealth: 98.5,
  })

  const handleRefreshStats = async () => {
    setIsRefreshing(true)

    // Simulate API call to refresh stats
    setTimeout(() => {
      setStats((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        todayEvents: prev.todayEvents,
        liveAttendance: prev.liveAttendance + Math.floor(Math.random() * 20) - 10,
        systemHealth: Math.max(95, Math.min(100, prev.systemHealth + Math.random() * 2 - 1)),
      }))
      setLastUpdated(new Date())
      setIsRefreshing(false)
      toast({
        title: "Stats Refreshed",
        description: "Dashboard statistics have been updated",
      })
    }, 1500)
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        liveAttendance: Math.max(0, prev.liveAttendance + Math.floor(Math.random() * 6) - 3),
      }))
      setLastUpdated(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">Live System Stats</CardTitle>
          <CardDescription>Last updated: {lastUpdated.toLocaleTimeString()}</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefreshStats} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Users</span>
              <Badge variant="secondary">
                <Users className="h-3 w-3 mr-1" />
                {stats.activeUsers}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Today's Events</span>
              <Badge variant="secondary">
                <Calendar className="h-3 w-3 mr-1" />
                {stats.todayEvents}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Live Attendance</span>
              <Badge variant={stats.liveAttendance > 80 ? "default" : "secondary"}>
                {stats.liveAttendance > 80 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stats.liveAttendance}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">System Health</span>
              <Badge variant={stats.systemHealth > 95 ? "default" : "destructive"}>
                {stats.systemHealth.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
