"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { useEvents } from "@/hooks/use-events"

interface EventsContextType {
  upcomingEventsCount: number
  totalEventsCount: number
  refreshEventCounts: () => Promise<void>
  isLoading: boolean
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const eventsHook = useEvents()
  const eventsHookRef = useRef(eventsHook)
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0)
  const [totalEventsCount, setTotalEventsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    eventsHookRef.current = eventsHook
  }, [eventsHook])

  const refreshEventCounts = useCallback(async () => {
    try {
      setIsLoading(true)
      const [upcoming, allEvents] = await Promise.all([
        eventsHookRef.current.getUpcomingEvents(),
        eventsHookRef.current.getAllEvents(),
      ])

      if (!mountedRef.current) return

      setUpcomingEventsCount(upcoming.length)
      setTotalEventsCount(allEvents.length)
    } catch (error) {
      console.error("❌ Failed to fetch event counts:", error)
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    refreshEventCounts()

    return () => {
      mountedRef.current = false
    }
  }, [refreshEventCounts])

  return (
    <EventsContext.Provider
      value={{
        upcomingEventsCount,
        totalEventsCount,
        refreshEventCounts,
        isLoading,
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}

export function useEventsContext() {
  const context = useContext(EventsContext)
  if (context === undefined) {
    throw new Error("useEventsContext must be used within an EventsProvider")
  }
  return context
}

