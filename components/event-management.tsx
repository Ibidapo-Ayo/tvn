"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Form } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar, Plus, Users, Clock, Edit, Trash2, Search } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useEvents } from "@/hooks/use-events"
import { Event } from "@/types/types"
import CustomInput from "@/components/input/CustomInput"
import { FormFieldTypes } from "@/lib/utils"
import { eventFormSchema, type EventFormValues } from "@/lib/validations"
import { useEventsContext } from "@/contexts/events-context"

export function EventManagement() {
  const { getAllEvents, createEvent, updateEvent, deleteEvent } = useEvents()
  const { refreshEventCounts } = useEventsContext()
  
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [isEditEventOpen, setIsEditEventOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [events, setEvents] = useState<Event[]>([])

  // Create Event Form
  const createForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      type: "sunday_service",
    },
  })

  // Edit Event Form
  const editForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      type: "sunday_service",
    },
  })

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const fetchedEvents = await getAllEvents()
      setEvents(fetchedEvents)
    } catch (error) {
      console.error("❌ Events Page: Failed to fetch events:", error)
      toast.error("Failed to load events")
    } finally {
      setIsLoading(false)
    }
  }

  const onCreateSubmit = async (data: EventFormValues) => {
    try {
      setIsSaving(true)
      await createEvent(data)
      await refreshEventCounts()
      
      toast.success("Event created successfully!")

      createForm.reset()
      setIsCreateEventOpen(false)
    } catch (error) {
      console.error("Failed to create event:", error)
      toast.error("Failed to create event")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditEvent = (event: Event) => {
    const dateOnly = typeof event.date === 'string' && event.date.includes('T') 
      ? event.date.split('T')[0] 
      : new Date(event.date as string).toISOString().split('T')[0]
    
    const dateObj = new Date(dateOnly)
    
    let timeObj = new Date()
    const timeValue = event.time || ""
    if (timeValue) {
      if (typeof timeValue === 'string' && (timeValue.includes('AM') || timeValue.includes('PM'))) {
        const [time, period] = typeof timeValue === 'string' ? timeValue.split(' ') : ['', '']
        const [hours, minutes] = time.split(':')
        let hour24 = parseInt(hours)
        if (period === 'PM' && hour24 !== 12) hour24 += 12
        if (period === 'AM' && hour24 === 12) hour24 = 0
        timeObj.setHours(hour24, parseInt(minutes), 0, 0)
      } else {  
        const [hours, minutes] = typeof timeValue === 'string' ? timeValue.split(':') : ['0', '0']
        timeObj.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      }
    }
    
    setSelectedEvent(event)
    editForm.reset({
      title: event.title,
      description: event.description,
      date: dateObj as any,
      time: timeObj as any,
      type: event.type,
    })
    setIsEditEventOpen(true)
  }

  const onEditSubmit = async (data: EventFormValues) => {
    if (!selectedEvent) return

    try {
      setIsSaving(true)
      
      const dateValue = data.date
      const timeValue = data.time
      
      let timestamp = dateValue
      if (timeValue && dateValue) {
        const dateStr = typeof dateValue === 'string' && dateValue.includes('T') ? dateValue : `${dateValue}T${timeValue}`
        timestamp = new Date(dateStr as string).toISOString()
      }
      
      await updateEvent(selectedEvent.id, {
        title: data.title,
        description: data.description,
        date: timestamp,
        time: timeValue,
        type: data.type,
      })
      
      await fetchEvents()
      
      await refreshEventCounts()
      
      toast.success("Event updated successfully!")
      setIsEditEventOpen(false)
      setSelectedEvent(null)
    } catch (error) {
      console.error("Failed to update event:", error)
      toast.error("Failed to update event")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!eventToDelete) return

    try {
      await deleteEvent(eventToDelete.id)
      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id))
      
      await refreshEventCounts()
      
      toast.success("Event deleted successfully")
      setIsDeleteDialogOpen(false)
      setEventToDelete(null)
    } catch (error) {
      console.error("Failed to delete event:", error)
      toast.error("Failed to delete event")
    }
  }

  const getEventColor = (type: Event["type"]): string => {
    const colors = {
      sunday_service: "from-blue-500 to-blue-600",
      sod: "from-purple-500 to-purple-600",
      sop: "from-orange-500 to-orange-600",
    } as const
    return colors[type] || "from-slate-500 to-slate-600"
  }

  const getEventBadgeColor = (type: Event["type"]) => {
    const colors: Record<Event["type"], string> = {
      sunday_service: "bg-blue-100 text-blue-700 border-blue-200",
      sod: "bg-purple-100 text-purple-700 border-purple-200",
      sop: "bg-orange-100 text-orange-700 border-orange-200",
    }
    return colors[type] || "bg-slate-100 text-slate-700 border-slate-200"
  }

  const getEventTypeName = (type: Event["type"]) => {
    const names: Record<Event["type"], string> = {
      sunday_service: "Sunday Service",
      sod: "School of Doctrine",
      sop: "School of Prayer",
    }
    return names[type] || "Other"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading events...</p>
          <p className="text-slate-400 text-sm mt-2">Please wait</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-6 pt-4">
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
          onClick={() => setIsCreateEventOpen(true)}
          className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl h-12 px-6 rounded-xl font-semibold"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-orange-400 rounded-2xl bg-white"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-orange-100/50 to-purple-100/30 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

              <CardContent className="relative p-6">
                <div className="space-y-5">
                  {/* Title and Type Badge */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-xl text-slate-900 group-hover:text-orange-600 transition-colors flex-1">
                        {event.title}
                      </h3>
                      <Badge className={`${getEventBadgeColor(event.type)} border shrink-0`}>
                        {getEventTypeName(event.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-linear-to-r from-orange-50 to-orange-50/50">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Date</p>
                        <p className="text-sm font-bold text-slate-900">{formatDate(event.date as string)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-linear-to-r from-purple-50 to-purple-50/50">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Time</p>
                        <p className="text-sm font-bold text-slate-900">{event.time as string || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-linear-to-r from-green-50 to-green-50/50">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Registered</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">
                            {event.attendees?.length || 0} attendees
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleEditEvent(event)}
                      variant="outline"
                      className="flex-1 h-10 rounded-xl border-slate-300 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteEvent(event)}
                      variant="outline"
                      className="flex-1 h-10 rounded-xl border-slate-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="shadow-lg border-slate-200 rounded-2xl">
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-linear-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                {searchQuery ? (
                  <Search className="h-10 w-10 text-orange-600" />
                ) : (
                  <Calendar className="h-10 w-10 text-orange-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {searchQuery ? "No Events Found" : "No Events Yet"}
                </h3>
                <p className="text-slate-600 mb-6">
                  {searchQuery
                    ? "No events match your search. Try different keywords."
                    : "You haven't created any events yet. Create your first event to get started!"}
                </p>
              </div>
              {!searchQuery && (
                <Button
                  onClick={() => setIsCreateEventOpen(true)}
                  className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg h-11 px-6 rounded-xl font-semibold"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Event
                </Button>
              )}
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="h-11 px-6 rounded-xl font-semibold"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Event Dialog */}
      <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Event</DialogTitle>
          </DialogHeader>

          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4 py-4">
              <CustomInput
                control={createForm.control}
                fieldType={FormFieldTypes.INPUT}
                name="title"
                label="Event Title *"
                placeholder="e.g., Sunday Service"
              />

              <CustomInput
                control={createForm.control}
                fieldType={FormFieldTypes.SELECT}
                name="type"
                label="Event Type *"
                placeholder="Select event type"
              >
                <SelectItem value="sunday_service">Sunday Service</SelectItem>
                <SelectItem value="sod">SOD</SelectItem>
                <SelectItem value="sop">SOP</SelectItem>
              </CustomInput>

              <CustomInput
                control={createForm.control}
                fieldType={FormFieldTypes.TEXTAREA}
                name="description"
                label="Description"
                placeholder="Brief description..."
              />

              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  control={createForm.control}
                  fieldType={FormFieldTypes.DATE_PICKER}
                  name="date"
                  label="Date *"
                  placeholder="Select date"
                  dateFormat="MM/dd/yyyy"
                  showTimeSelect={false}
                />
                <CustomInput
                  control={createForm.control}
                  fieldType={FormFieldTypes.DATE_PICKER}
                  name="time"
                  label="Time *"
                  placeholder="Select time"
                  dateFormat="h:mm aa"
                  showTimeSelect={true}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setIsCreateEventOpen(false)} 
                  className="h-11 rounded-xl"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl"
                  disabled={isSaving}
                >
                  {isSaving ? "Creating..." : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Event</DialogTitle>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
              <CustomInput
                control={editForm.control}
                fieldType={FormFieldTypes.INPUT}
                name="title"
                label="Event Title"
                placeholder="e.g., Sunday Service"
              />

              <CustomInput
                control={editForm.control}
                fieldType={FormFieldTypes.SELECT}
                name="type"
                label="Event Type"
                placeholder="Select event type"
              >
                <SelectItem value="sunday_service">Sunday Service</SelectItem>
                <SelectItem value="sod">SOD</SelectItem>
                <SelectItem value="sop">SOP</SelectItem>
              </CustomInput>

              <CustomInput
                control={editForm.control}
                fieldType={FormFieldTypes.TEXTAREA}
                name="description"
                label="Description"
                placeholder="Brief description..."
              />

              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  control={editForm.control}
                  fieldType={FormFieldTypes.DATE_PICKER}
                  name="date"
                  label="Date"
                  placeholder="Select date"
                  dateFormat="MM/dd/yyyy"
                  showTimeSelect={false}
                />
                <CustomInput
                  control={editForm.control}
                  fieldType={FormFieldTypes.DATE_PICKER}
                  name="time"
                  label="Time"
                  placeholder="Select time"
                  dateFormat="h:mm aa"
                  showTimeSelect={true}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setIsEditEventOpen(false)} 
                  className="h-11 rounded-xl"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl"
                  disabled={isSaving}
                >
                  {isSaving ? "Updating..." : "Update Event"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
