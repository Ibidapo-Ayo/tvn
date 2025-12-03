"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { Calendar } from "lucide-react"
import CustomInput from "@/components/input/CustomInput"
import { FormFieldTypes } from "@/lib/utils"
import {
  eventRegistrationSchema,
  type EventRegistrationValues,
} from "@/lib/validations"
import { useEvents } from "@/hooks/use-events"
import { Event } from "@/types/types"
import { SelectItem } from "@/components/ui/select"

interface EventRegistrationFormProps {
  selectedEvent?: Event | null
  enableEventSelect?: boolean
  isEventClosed?: boolean
}

export function EventRegistrationForm({
  selectedEvent,
  enableEventSelect = true,
  isEventClosed = false,
}: EventRegistrationFormProps) {
  const form = useForm<EventRegistrationValues>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      selectedEventId: selectedEvent?.id || "",
    },
  })

  const [events, setEvents] = useState<Event[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { getUpcomingEvents } = useEvents()

  useEffect(() => {
    if (!enableEventSelect) return
    const fetchEvents = async () => {
      try {
        const upcoming = await getUpcomingEvents()
        setEvents(upcoming)
      } catch (error) {
        console.error("Failed to load events:", error)
        toast.error("Unable to load events. Please try again later.")
      }
    }

    fetchEvents()
  }, [enableEventSelect, getUpcomingEvents])

  useEffect(() => {
    if (selectedEvent?.id) {
      form.setValue("selectedEventId", selectedEvent.id)
    }
  }, [selectedEvent, form])

  const eventOptions = useMemo(() => {
    if (!events || events.length === 0) return []
    return events.map((event) => ({
      value: event.id,
      label: event.title,
      date: event.date,
      description: event.description,
    }))
  }, [events])

  const onSubmit = async (data: EventRegistrationValues) => {
    if (isEventClosed) return
    try {
      setIsSubmitting(true)
      console.log("Event registration payload:", data)
      toast.success("Thanks for registering! We’ll reach out soon.")
      form.reset()
    } catch (error) {
      toast.error("Unable to submit registration. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="shadow-xl border-slate-200/70">
      <CardContent className="p-6 md:p-10 space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider">
            Secure Your Spot
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            Register for an Upcoming Event
          </h1>
          <p className="text-slate-600 max-w-2xl">
            Fill the form below with your contact details and choose the event
            you’d love to attend. A confirmation email will follow shortly.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CustomInput
                control={form.control}
                name="name"
                label="Full Name"
                placeholder="e.g., John Doe"
                fieldType={FormFieldTypes.INPUT}
                iconSrc="/icons/user.svg"
                iconAlt="user"
                type="text"
              />

              <CustomInput
                control={form.control}
                name="email"
                label="Email Address"
                placeholder="you@example.com"
                fieldType={FormFieldTypes.INPUT}
                type="email"
                iconSrc="/icons/email.svg"
                iconAlt="email"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CustomInput
                control={form.control}
                name="phone"
                label="Phone Number"
                placeholder="+234 900 000 0000"
                fieldType={FormFieldTypes.PHONE_INPUT}
              />

              {enableEventSelect ? (
                <CustomInput
                  control={form.control}
                  name="selectedEventId"
                  label="Select Event"
                  placeholder="Choose an event"
                  fieldType={FormFieldTypes.SELECT}
                >
                  {eventOptions.length === 0 ? (
                    <SelectItem value="" disabled>
                      No events available
                    </SelectItem>
                  ) : (
                    eventOptions.map((event) => (
                      <SelectItem key={event.value} value={event.value}>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{event.label}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(event.date).toLocaleString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </CustomInput>
              ) : (
                selectedEvent && (
                  <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-slate-600">
                      Event Selected
                    </p>
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedEvent.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {selectedEvent.description}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(selectedEvent.date).toLocaleString()}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="space-y-4 bg-orange-50/70 border border-orange-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-10 h-10 text-orange-600" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Why register ahead?
                  </p>
                  <p className="text-sm text-slate-600">
                    Secures your seat, keeps you updated, and helps us prepare
                    for you.
                  </p>
                </div>
              </div>
            </div>

            {isEventClosed && (
              <div className="rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm p-4">
                Registration for this event has ended.
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg rounded-xl shadow-lg"
              disabled={isSubmitting || isEventClosed}
            >
              {isEventClosed
                ? "Registration Closed"
                : isSubmitting
                ? "Submitting..."
                : "Register Now"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

