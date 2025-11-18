"use client";
import { useEvents } from "@/hooks/use-events";
import { useMembers } from "@/hooks/use-members";

export function useAll() {
  const { getAllEvents, getUpcomingEvents, getRecentEvents } = useEvents();
  const { getAllMembers } = useMembers();

  return { getAllEvents, getUpcomingEvents, getRecentEvents, getAllMembers };
}