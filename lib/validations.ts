import { z } from "zod"

// Login Form Validation
export const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>

// Event Form Validation
export const eventFormSchema = z.object({
  title: z.string().min(3, "Event title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.union([z.string(), z.date()]).refine((val) => val !== null && val !== undefined, {
    message: "Date is required",
  }),
  time: z.union([z.string(), z.date()]).refine((val) => val !== null && val !== undefined, {
    message: "Time is required",
  }),
  type: z.enum(["sunday_service", "sod", "sop"], {
    required_error: "Please select an event type",
  }),
})

export type EventFormValues = z.infer<typeof eventFormSchema>

// Member Registration Form Validation
export const memberRegistrationSchema = z.object({
  // Personal Information
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender",
  }),
  nationality: z.string().min(2, "Nationality is required"),
  nin: z.string().optional(),
  
  // Family Information
  familySize: z.number().min(1).optional(),
  positionInFamily: z.string().optional(),
  
  // Education Information
  currentEducationalLevel: z.string().min(1, "Educational level is required"),
  school: z.string().optional(),
  university: z.string().optional(),
  level: z.string().optional(),
  
  // Location Information
  stateOfOrigin: z.string().min(1, "State of origin is required"),
  localGovernmentOfOrigin: z.string().optional(),
  stateOfResidence: z.string().min(1, "State of residence is required"),
  localGovernmentOfResidence: z.string().optional(),
  cityOfResidence: z.string().optional(),
  address: z.string().optional(),
  
  // Church Information
  community: z.string().min(1, "Community is required"),
  department: z.string().min(1, "Department is required"),
  userCategory: z.enum(["members", "polished_pillars", "just_men", "visionary_kids", "married_engaged"]).optional(),
  stewardsDepartment: z.string().optional(),
  
  // Contact Information
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  guardianOrParentContact: z.string().optional(),
  
  // Next of Kin
  nextOfKin: z.object({
    name: z.string().min(2, "Next of kin name is required"),
    relationship: z.string().min(2, "Relationship is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().optional(),
  }),
  
  // Account Details
  accountDetails: z.object({
    bankName: z.string(),
    accountNumber: z.string(),
    accountName: z.string(),
  }).optional(),
  
  // Attachments
  passportPhoto: z.string().optional(),
})

export type MemberRegistrationValues = z.infer<typeof memberRegistrationSchema>

// User Update Form Validation
export const userUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["admin", "user", "pastor", "leader", "member"], {
    required_error: "Please select a role",
  }),
  community: z.string().min(1, "Community is required"),
  department: z.string().min(1, "Department is required"),
  userCategory: z.enum(["members", "polished_pillars", "just_men", "visionary_kids", "married_engaged"]).optional(),
})

export type UserUpdateValues = z.infer<typeof userUpdateSchema>

// Birthday Message Form Validation
export const birthdayMessageSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  template: z.string().min(10, "Message template must be at least 10 characters"),
  isActive: z.boolean().default(true),
})

export type BirthdayMessageValues = z.infer<typeof birthdayMessageSchema>

// Attendance Form Validation
export const attendanceFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  eventId: z.string().min(1, "Event ID is required"),
  method: z.enum(["fingerprint", "facial_recognition", "manual"], {
    required_error: "Please select an attendance method",
  }),
  timestamp: z.string().optional(),
})

export type AttendanceFormValues = z.infer<typeof attendanceFormSchema>

// Program Registration Validation
export const programRegistrationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  eventId: z.string().min(1, "Event ID is required"),
  notes: z.string().optional(),
})

export type ProgramRegistrationValues = z.infer<typeof programRegistrationSchema>

