"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Users, TrendingUp, CheckCircle2, Edit, Search, Sparkles, Plus, Filter, X } from "lucide-react"
import { toast } from "sonner"

interface EventAttendance {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "sunday_service" | "midweek" | "special" | "other"
  attendees: number
  maxCapacity: number
}

export function AttendanceTracking() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventAttendance | null>(null)
  const [attendanceInput, setAttendanceInput] = useState("")
  
  // Filter states
  const [filterType, setFilterType] = useState<string>("all")
  const [filterDateFrom, setFilterDateFrom] = useState("")
  const [filterDateTo, setFilterDateTo] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Create form state
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "sunday_service" as EventAttendance["type"],
    attendees: "",
    maxCapacity: "",
  })

  const [events, setEvents] = useState<EventAttendance[]>([
    {
      id: "1",
      title: "Sunday Morning Service",
      description: "Weekly Sunday worship service",
      date: "2025-01-12",
      time: "10:00 AM",
      type: "sunday_service",
      attendees: 156,
      maxCapacity: 200,
    },
    {
      id: "2",
      title: "Midweek Prayer Meeting",
      description: "Wednesday evening prayer session",
      date: "2025-01-15",
      time: "07:00 PM",
      type: "midweek",
      attendees: 89,
      maxCapacity: 150,
    },
    {
      id: "3",
      title: "Youth Conference 2025",
      description: "Annual youth conference",
      date: "2025-01-20",
      time: "09:00 AM",
      type: "special",
      attendees: 234,
      maxCapacity: 300,
    },
    {
      id: "4",
      title: "Family & Friends Day",
      description: "Special celebration service",
      date: "2025-02-01",
      time: "09:00 AM",
      type: "special",
      attendees: 0,
      maxCapacity: 250,
    },
  ])

  const handleOpenUpdateDialog = (event: EventAttendance) => {
    setSelectedEvent(event)
    setAttendanceInput(event.attendees.toString())
    setIsUpdateDialogOpen(true)
  }

  const handleUpdateAttendance = () => {
    if (!selectedEvent) return

    const newAttendance = Number.parseInt(attendanceInput)

    if (isNaN(newAttendance) || newAttendance < 0) {
      toast.error("Please enter a valid number")
      return
    }

    if (newAttendance > selectedEvent.maxCapacity) {
      toast.error(`Attendance exceeds max capacity of ${selectedEvent.maxCapacity}`)
      return
    }

    setEvents((prev) =>
      prev.map((e) => (e.id === selectedEvent.id ? { ...e, attendees: newAttendance } : e))
    )

    toast.success("Attendance updated successfully!")
    setIsUpdateDialogOpen(false)
    setSelectedEvent(null)
    setAttendanceInput("")
  }

  const handleCreateAttendance = () => {
    // Validate form
    if (!createForm.title || !createForm.date || !createForm.time) {
      toast.error("Please fill in all required fields")
      return
    }

    const attendees = Number.parseInt(createForm.attendees) || 0
    const capacity = Number.parseInt(createForm.maxCapacity) || 100

    if (attendees > capacity) {
      toast.error(`Attendance exceeds max capacity of ${capacity}`)
      return
    }

    const newEvent: EventAttendance = {
      id: `event-${Date.now()}`,
      title: createForm.title,
      description: createForm.description,
      date: createForm.date,
      time: createForm.time,
      type: createForm.type,
      attendees: attendees,
      maxCapacity: capacity,
    }

    setEvents((prev) => [...prev, newEvent])
    toast.success("Attendance record created successfully!")

    // Reset form
    setCreateForm({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "sunday_service",
      attendees: "",
      maxCapacity: "",
    })
    setIsCreateDialogOpen(false)
  }

  const clearFilters = () => {
    setFilterType("all")
    setFilterDateFrom("")
    setFilterDateTo("")
    setSearchQuery("")
  }

  const getEventColor = (type: EventAttendance["type"]) => {
    const colors = {
      sunday_service: "from-blue-500 to-blue-600",
      midweek: "from-purple-500 to-purple-600",
      special: "from-orange-500 to-orange-600",
      other: "from-slate-500 to-slate-600",
    }
    return colors[type]
  }

  const getEventTypeName = (type: EventAttendance["type"]) => {
    const names = {
      sunday_service: "Sunday Service",
      midweek: "Mid-Week",
      special: "Special Event",
      other: "Other",
    }
    return names[type]
  }

  const getAttendancePercentage = (attendees: number, capacity: number) => {
    return Math.round((attendees / capacity) * 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTotalAttendees = () => {
    return filteredEvents.reduce((sum, event) => sum + event.attendees, 0)
  }

  const getAverageAttendance = () => {
    const total = getTotalAttendees()
    return filteredEvents.length > 0 ? Math.round(total / filteredEvents.length) : 0
  }

  // Apply filters
  const filteredEvents = events.filter((e) => {
    // Search filter
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Type filter
    const matchesType = filterType === "all" || e.type === filterType

    // Date range filter
    let matchesDateRange = true
    if (filterDateFrom && filterDateTo) {
      const eventDate = new Date(e.date)
      const fromDate = new Date(filterDateFrom)
      const toDate = new Date(filterDateTo)
      matchesDateRange = eventDate >= fromDate && eventDate <= toDate
    } else if (filterDateFrom) {
      const eventDate = new Date(e.date)
      const fromDate = new Date(filterDateFrom)
      matchesDateRange = eventDate >= fromDate
    } else if (filterDateTo) {
      const eventDate = new Date(e.date)
      const toDate = new Date(filterDateTo)
      matchesDateRange = eventDate <= toDate
    }

    return matchesSearch && matchesType && matchesDateRange
  })

  const hasActiveFilters = filterType !== "all" || filterDateFrom || filterDateTo || searchQuery

  return (
    <div className="space-y-8">
      {/* Header with Search and Filters */}
      <div className="pt-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm"
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className={`h-12 px-6 rounded-xl border-slate-300 ${showFilters ? "bg-orange-50 border-orange-400 text-orange-600" : ""}`}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl h-12 px-6 rounded-xl font-semibold"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Record
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="shadow-lg border-slate-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-900">Filter Events</h3>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Event Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="sunday_service">Sunday Service</SelectItem>
                      <SelectItem value="midweek">Mid-Week</SelectItem>
                      <SelectItem value="special">Special Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Date From</Label>
                  <Input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Date To</Label>
                  <Input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  {hasActiveFilters ? "Filtered Events" : "Total Events"}
                </p>
                <p className="text-3xl font-bold text-slate-900">{filteredEvents.length}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Calendar className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Attendees</p>
                <p className="text-3xl font-bold text-slate-900">{getTotalAttendees()}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Average Attendance</p>
                <p className="text-3xl font-bold text-slate-900">{getAverageAttendance()}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const percentage = getAttendancePercentage(event.attendees, event.maxCapacity)
            const isHighAttendance = percentage >= 80

            return (
              <Card
                key={event.id}
                className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-orange-400 rounded-2xl bg-white"
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/50 to-purple-100/30 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                <CardContent className="relative p-6">
                  <div className="space-y-5">
                    {/* Title and Type */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-xl text-slate-900 group-hover:text-orange-600 transition-colors flex-1">
                          {event.title}
                        </h3>
                        <Badge className="bg-orange-100 text-orange-700 border-orange-200 shrink-0">
                          {getEventTypeName(event.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-1">{event.description}</p>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-orange-50/50">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Date & Time</p>
                        <p className="text-sm font-bold text-slate-900">
                          {formatDate(event.date)} • {event.time}
                        </p>
                      </div>
                    </div>

                    {/* Attendance Display */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-purple-50/30 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Attendance</span>
                        <Badge
                          className={`${
                            isHighAttendance
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                          }`}
                        >
                          {percentage}%
                        </Badge>
                      </div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold text-slate-900">{event.attendees}</span>
                        <span className="text-sm text-slate-500">/ {event.maxCapacity}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${isHighAttendance ? "from-green-500 to-green-600" : "from-blue-500 to-blue-600"} transition-all duration-500`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Update Button */}
                    <Button
                      onClick={() => handleOpenUpdateDialog(event)}
                      className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl rounded-xl font-bold transition-all duration-300"
                    >
                      <Edit className="h-5 w-5 mr-2" />
                      Update Attendance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="shadow-lg border-slate-200 rounded-2xl">
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-10 w-10 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Events Found</h3>
                <p className="text-slate-600 mb-4">
                  {hasActiveFilters
                    ? "No events match your filters. Try adjusting your search criteria."
                    : "No events available for attendance tracking."}
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="border-orange-400 text-orange-600 hover:bg-orange-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Attendance Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create Attendance Record</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-title">Event Title *</Label>
              <Input
                id="create-title"
                placeholder="e.g., Sunday Service"
                value={createForm.title}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-type">Event Type *</Label>
              <Select
                value={createForm.type}
                onValueChange={(value: EventAttendance["type"]) =>
                  setCreateForm((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday_service">Sunday Service</SelectItem>
                  <SelectItem value="midweek">Mid-Week</SelectItem>
                  <SelectItem value="special">Special Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
                placeholder="Brief description..."
                value={createForm.description}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-date">Date *</Label>
                <Input
                  id="create-date"
                  type="date"
                  value={createForm.date}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, date: e.target.value }))}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-time">Time *</Label>
                <Input
                  id="create-time"
                  type="time"
                  value={createForm.time}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, time: e.target.value }))}
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-attendees">Attendees</Label>
                <Input
                  id="create-attendees"
                  type="number"
                  min="0"
                  placeholder="e.g., 150"
                  value={createForm.attendees}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, attendees: e.target.value }))}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-capacity">Max Capacity</Label>
                <Input
                  id="create-capacity"
                  type="number"
                  min="0"
                  placeholder="e.g., 200"
                  value={createForm.maxCapacity}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, maxCapacity: e.target.value }))}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="h-11">
              Cancel
            </Button>
            <Button
              onClick={handleCreateAttendance}
              className="h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Create Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Attendance Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Update Attendance</DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-5 py-4">
              {/* Event Info */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200">
                <p className="font-semibold text-slate-900 mb-1">{selectedEvent.title}</p>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedEvent.date)} • {selectedEvent.time}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Max Capacity: <span className="font-bold text-slate-900">{selectedEvent.maxCapacity}</span>
                </div>
              </div>

              {/* Attendance Input */}
              <div className="space-y-2">
                <Label htmlFor="attendance" className="text-slate-700 font-medium">
                  Number of Attendees *
                </Label>
                <Input
                  id="attendance"
                  type="number"
                  min="0"
                  max={selectedEvent.maxCapacity}
                  placeholder="Enter number of attendees"
                  value={attendanceInput}
                  onChange={(e) => setAttendanceInput(e.target.value)}
                  className="h-12 text-lg"
                />
                <p className="text-xs text-slate-500">
                  Enter the total number of people who attended this event
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)} className="h-11">
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAttendance}
              className="h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Update Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
