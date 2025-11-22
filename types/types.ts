export interface Member {
  // System Fields
  id: string
  createdAt?: string // ISO string for tracking when member was added
  
  // Personal Information
  name: string
  email?: string
  dob: any // Firestore Timestamp {seconds, nanoseconds} or ISO string
  gender: "male" | "female" | string
  nationality: string
  nin?: string 
  
  // Location Information
  state_of_origin: string
  state_of_residence: string
  lga: string // Local Government Area
  city_of_residence: string
  residential_address: string
  
  // Family Information
  family_size: number
  position_in_family: string
  
  // Education
  highest_level_of_education: string
  
  // Contact Information
  phone_number: string
  g_phone_number?: string // Guardian phone number
  
  // Next of Kin
  next_of_kin?: {
    name: string
    relationship: string
    phone: string
    address?: string
  }
  
  // Bank Details
  bank_details?: {
    account_name: string
    account_number?: string
    bank_name?: string
  }
  
  // Church Information
  user_category?: string // "Just men", "Polished Pillars", etc.
  
  // Attachments
  passport_photo_url?: string
  }

// Keep User interface for backward compatibility with auth
export interface User extends Member {
  role?: "admin" | "user" | "pastor" | "leader" | "member"
  membershipId?: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string // ISO string (converted from Firestore Timestamp {seconds, nanoseconds})
  time?: string // extracted time from timestamp (e.g., "02:30 PM")
  type: "sunday_service" | "sod" | "sop"
  createdBy?: string
  attendees: string[] 
  createdAt?: string
}

export interface AttendanceRecord {
  id: string
  userId: string
  eventId: string
  timestamp: string
  method: "fingerprint" | "facial_recognition" | "manual"
  verified: boolean
}

export interface BirthdayMessage {
  id: string
  template: string
  subject: string
  isActive: boolean
  createdAt: string
}

export interface ProgramRegistration {
  id: string
  userId: string
  eventId: string
  registeredAt: string
  status: "registered" | "confirmed" | "attended" | "cancelled"
  notes?: string
}

export interface MembershipCard {
  membershipId: string
  userId: string
  name: string
  passportPhoto?: string
  community: string
  department: string
  issueDate: string
  expiryDate?: string
  qrCode?: string // For scanning
}

