"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Calendar, Clock, MapPin } from "lucide-react"
import { EventRegistrationForm } from "@/components/event-registration-form"
import { Event } from "@/types/types"
import { useEvents } from "@/hooks/use-events"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

export default function EventRegistrationDetailsPage() {
  const params = useParams()
  const eventId = params?.eventId as string
  const { getEventById } = useEvents()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!eventId) return
        const fetched = await getEventById(eventId)
        setEvent(fetched)
      } catch (error) {
        console.error("Failed to load event:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [eventId, getEventById])

  const eventDateTime = useMemo(() => {
    if (!event?.date) return null
    if (typeof event.date === 'string' && event.date.includes("T")) {
      return new Date(event.date as string)
    }
    if (event.time) {
      return new Date(`${event.date as string}T${event.time as string}`)
    }
    return new Date(event.date as string)
  }, [event])

  const eventHasEnded = useMemo(() => {
    if (!eventDateTime) return false
    return new Date() > eventDateTime
  }, [eventDateTime])

  if (!eventId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Invalid event
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Event not found
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
            {eventHasEnded ? "Event Ended" : "Featured Event"}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            {event.title}
          </h1>
          <p className="text-lg text-slate-600">{event.description}</p>

          <div className="relative">
            <div className="absolute -inset-2 rounded-[32px] bg-linear-to-r from-orange-500/20 to-purple-500/20 blur-3xl"></div>
            <Image
              src="/placeholder.jpg"
              alt={event.title}
              width={900}
              height={600}
              className="relative rounded-[32px] shadow-2xl border border-white/60 object-cover w-full h-[420px]"
              priority
            />
          </div>

          <Card className="border-slate-200/80 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-slate-800">
                  {formatDate(event.date as string)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-slate-800">
                  {event.time as string || "Time to be announced"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-slate-800">
                  {event.type.replace("_", " ").toUpperCase()}
                </span>
              </div>
              {eventHasEnded && (
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-600 border-red-200"
                >
                  This event has already ended
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl w-full mx-auto">
          <EventRegistrationForm
            selectedEvent={event}
            enableEventSelect={false}
            isEventClosed={eventHasEnded}
          />
        </div>
      </div>
    </main>
  )
}

