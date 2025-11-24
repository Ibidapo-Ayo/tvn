"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { Event } from "@/types/types";

const extractDateFromTimestamp = (timestamp: any): string => {
  try {
    if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    }
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      return date.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  } catch (error) {
    console.error("Error parsing timestamp:", error);
    return new Date().toISOString().split('T')[0];
  }
};

const extractTimeFromTimestamp = (timestamp: any): string => {
  try {
    if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    return "";
  } catch (error) {
    console.error("Error parsing timestamp:", error);
    return "";
  }
};

const convertTimestampToISO = (timestamp: any): string => {
  try {
    if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
      return new Date(timestamp.seconds * 1000).toISOString();
    }
    // Handle ISO string
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    return new Date().toISOString();
  } catch (error) {
    console.error("Error converting timestamp:", error);
    return new Date().toISOString();
  }
};

const processEventData = (eventData: any): Event => {
  const dateISO = convertTimestampToISO(eventData.date);
  
  const time = eventData.time || extractTimeFromTimestamp(eventData.date);
  
  return {
    ...eventData,
    date: dateISO,
    time,
  } as Event;
};

export function useEvents() {
  const getAllEvents = async (): Promise<Event[]> => {
    try {
      const eventsRef = collection(db, "events");
      const querySnapshot = await getDocs(eventsRef);

      const events: Event[] = [];
      querySnapshot.forEach((doc) => {
        const eventData = processEventData({
          id: doc.id,
          ...doc.data(),
        });
        events.push(eventData);
      });

      events.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      return events;
    } catch (error: any) {
      console.error("❌ Failed to fetch all events:", error);
      throw error;
    }
  };

  const getUpcomingEvents = async (limit?: number): Promise<Event[]> => {
    try {
      const eventsRef = collection(db, "events");
      
      const querySnapshot = await getDocs(eventsRef);

      const events: Event[] = [];
      const todayTimestamp = new Date().setHours(0, 0, 0, 0);
      
      querySnapshot.forEach((doc) => {
        const rawData = doc.data();
        if (rawData.date) {
          // Convert Firestore timestamp to milliseconds for comparison
          let eventTimestamp: number;
          if (typeof rawData.date === 'object' && 'seconds' in rawData.date) {
            eventTimestamp = rawData.date.seconds * 1000;
          } else {
            eventTimestamp = new Date(rawData.date).getTime();
          }
          
          // Only include upcoming events
          if (eventTimestamp >= todayTimestamp) {
            const eventData = processEventData({
              id: doc.id,
              ...rawData,
            });
            events.push(eventData);
          }
        }
      });

      // Sort by date ascending (soonest first)
      events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return limit ? events.slice(0, limit) : events;
    } catch (error: any) {
      console.error("❌ Failed to fetch upcoming events:", error);
      throw error;
    }
  };

  const getRecentEvents = async (limit: number = 5): Promise<Event[]> => {
    try {
      const eventsRef = collection(db, "events");
      const querySnapshot = await getDocs(eventsRef);

      const events: Event[] = [];
      const todayTimestamp = new Date().setHours(0, 0, 0, 0);
      
      querySnapshot.forEach((doc) => {
        const rawData = doc.data();
        if (rawData.date) {
          let eventTimestamp: number;
          if (typeof rawData.date === 'object' && 'seconds' in rawData.date) {
            eventTimestamp = rawData.date.seconds * 1000;
          } else {
            eventTimestamp = new Date(rawData.date).getTime();  
          }
          if (eventTimestamp >= todayTimestamp) {
            const eventData = processEventData({
              id: doc.id,
              ...rawData,
            });
            events.push(eventData);
          }
        }
      });

      events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return events.slice(0, limit);
    } catch (error: any) {
      console.error("❌ Failed to fetch recent events:", error);
      throw error;
    }
  };

  const createEvent = async (eventData: Omit<Event, "id">) => {
    try {
      let timestamp = eventData.date;
      if (eventData.time && eventData.date) {
        const dateStr = eventData.date.includes('T') ? eventData.date : `${eventData.date}T${eventData.time}`;
        timestamp = new Date(dateStr).toISOString();
      }

      const eventDoc = {
        title: eventData.title,
        description: eventData.description,
        date: timestamp,
        time: eventData.time,
        type: eventData.type,
        createdBy: eventData.createdBy,
        attendees: eventData.attendees || [],
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "events"), eventDoc);

      return processEventData({ id: docRef.id, ...eventDoc });
    } catch (error: any) {
      console.error("Event creation failed:", error.message);
      throw error;
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: new Date().toISOString(),
      });

      return { id: eventId, ...eventData };
    } catch (error: any) {
      console.error("Event update failed:", error.message);
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const eventRef = doc(db, "events", eventId);
      await deleteDoc(eventRef);
    } catch (error: any) {
      console.error("Event deletion failed:", error.message);
      throw error;
    }
  };

  const getEventsByType = async (type: Event["type"]): Promise<Event[]> => {
    try {
      const eventsRef = collection(db, "events");
      const q = query(
        eventsRef,
        where("type", "==", type),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);

      const events: Event[] = [];
      querySnapshot.forEach((doc) => {
        const eventData = processEventData({
          id: doc.id,
          ...doc.data(),
        });
        events.push(eventData);
      });

      return events;
    } catch (error: any) {
      console.error("Failed to fetch events by type:", error.message);
      throw error;
    }
  };

  return {
    getAllEvents,
    getUpcomingEvents,
    getRecentEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByType,
  };
}

