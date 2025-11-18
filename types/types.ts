export interface User {
  // System Fields
  id: string
  membershipId?: string // Unique auto-generated membership ID
  email: string
  role: "admin" | "user" | "pastor" | "leader" | "member"
  createdAt: string
  name: string
  age: number
  gender: "male" | "female"
  dateOfBirth: string
  birthday: string 
  nationality: string
  stateOfOrigin: string
  localGovernmentOfOrigin: string
  stateOfResidence: string
  localGovernmentOfResidence: string
  cityOfResidence: string
  address: string
  positionInFamily: string 
  familySize: number
  currentEducationalLevel: string
  level?: string 
  school?: string 
  university?: string 
  nin?: string 
  userCategory?: "members" | "polished_pillars" | "just_men" | "visionary_kids" | "married_engaged" 
  community: string 
  department: string 
  stewardsDepartment?: string 
  
  phone: string
  guardianOrParentContact?: string
  nextOfKin: {
    name: string
    relationship: string
    phone: string
    address?: string
  }
  
  accountDetails?: {
    bankName: string
    accountNumber: string
    accountName: string
  }
  passportPhoto?: string 
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

export interface CreateMemberData {
  // Personal Information
  name: string
  email?: string
  dob: string
  birthday?: string
  gender: string
  nationality: string
  nin?: string
  
  // Family Information
  family_size?: string
  family_position?: string
  
  // Education Information
  education_level: string
  school?: string
  university?: string
  
  // Location Information
  state_of_origin: string
  lga_of_origin?: string
  state_of_residence: string
  lga_of_residence?: string
  city_of_residence?: string
  address?: string
  
  // Church Information
  community: string
  department: string
  category?: string
  
  // Contact Information
  phone_number: string
  phone_contact?: string
  guardian_contact?: string
  
  // Next of Kin
  next_of_kin?: string
  
  // Attachments & Security
  picture_url?: string
  fingerprint_data?: string
  
  // Account Details
  account_details?: string
  
  // Role
  role?: string
  
  // Any additional fields
  [key: string]: any
}
