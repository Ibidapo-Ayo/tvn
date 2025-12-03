"use client"

import { useMemo } from "react"
import { Event } from "@/types/types"

type CreateEventPayload = Omit<Event, "id">

interface UseEventsResult {
  getAllEvents: () => Promise<Event[]>
  getUpcomingEvents: (limit?: number) => Promise<Event[]>
  getRecentEvents: (limit?: number) => Promise<Event[]>
  createEvent: (eventData: CreateEventPayload) => Promise<Event>
  updateEvent: (eventId: string, eventData: Partial<Event>) => Promise<Event>
  deleteEvent: (eventId: string) => Promise<void>
  getEventsByType: (type: Event["type"]) => Promise<Event[]>
  getEventById: (eventId: string) => Promise<Event | null>
}

const warn = (method: string) => {
  console.warn(
    `[useEvents] ${method} is not implemented. Please provide your data integration.`
  )
}

export function useEvents(): UseEventsResult {
  return useMemo(
    () => ({
    async getAllEvents() {
      warn("getAllEvents")
      return []
    },
    async getUpcomingEvents() {
      warn("getUpcomingEvents")
      return []
    },
    async getRecentEvents() {
      warn("getRecentEvents")
      return []
    },
    async createEvent() {
      warn("createEvent")
      throw new Error("createEvent is not implemented")
    },
    async updateEvent() {
      warn("updateEvent")
      throw new Error("updateEvent is not implemented")
    },
    async deleteEvent() {
      warn("deleteEvent")
      throw new Error("deleteEvent is not implemented")
    },
    async getEventsByType() {
      warn("getEventsByType")
      return []
    },
    async getEventById() {
      warn("getEventById")
      return null
    },
    }),
    []
  )
}

