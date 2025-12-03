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

// Member Registration Form Validation (matches backend structure)
export const memberRegistrationSchema = z.object({
  // Personal Information
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  dob: z.union([z.string(), z.date()]).refine((val) => val !== "", {
    message: "Date of birth is required",
  }),
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().min(2, "Nationality is required"),
  nin: z.string().optional(),
  
  // Location Information
  state_of_origin: z.string().min(1, "State of origin is required"),
  state_of_residence: z.string().min(1, "State of residence is required"),
  lga: z.string().min(1, "Local government area is required"),
  city_of_residence: z.string().min(1, "City of residence is required"),
  residential_address: z.string().min(5, "Residential address is required"),
  
  // Family Information
  family_size: z.union([z.string(), z.number()]).transform((val) => 
    typeof val === "string" ? parseInt(val, 10) : val
  ),
  position_in_family: z.string().min(1, "Position in family is required"),
  
  // Education Information
  highest_level_of_education: z.string().min(1, "Educational level is required"),
  
  // Contact Information
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  g_phone_number: z.string().optional(),
  
  // Church Information
  user_category: z.string().optional(),
  
  // Next of Kin (optional but if provided, must be complete)
  next_of_kin: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
  
  // Bank Details (optional)
  bank_details: z.object({
    bank_name: z.string().optional(),
    account_number: z.string().optional(),
    account_name: z.string().min(2, "Account name is required"),
  }).optional(),
  
  // Attachments
  passport_photo_url: z.string().optional(),
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

// Public Event Registration Validation
export const eventRegistrationSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Enter a valid phone number"),
  selectedEventId: z.string().min(1, "Please select an event to register"),
})

export type EventRegistrationValues = z.infer<typeof eventRegistrationSchema>

