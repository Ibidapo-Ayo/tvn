"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { User, MapPin, Church, Phone, Camera, FileSignature, CheckCircle2, Upload, ArrowRight, ArrowLeft, Fingerprint } from "lucide-react"
import type { User as UserType } from "@/types/types"
import { useAuth } from "@/hooks/use-auth"

interface MemberRegistrationProps {
  onComplete?: (member: Partial<UserType>) => void
}

const steps = [
  { id: "category", title: "Category", icon: User },
  { id: "personal", title: "Personal Info", icon: User },
  { id: "education", title: "Education", icon: Church },
  { id: "location", title: "Location", icon: MapPin },
  { id: "church", title: "Church Info", icon: Church },
  { id: "contact", title: "Contact", icon: Phone },
  { id: "attachments", title: "Attachments", icon: Camera },
]

export function MemberRegistration({ onComplete }: MemberRegistrationProps) {
  const { createMember } = useAuth()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<UserType>>({
    role: "member",
    createdAt: new Date().toISOString(),
  })
  
  const [passportFile, setPassportFile] = useState<File | null>(null)
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [passportPreview, setPassportPreview] = useState<string | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
  
  const passportInputRef = useRef<HTMLInputElement>(null)
  const signatureInputRef = useRef<HTMLInputElement>(null)

  const currentStep = steps[currentStepIndex]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof UserType] as any),
        [field]: value,
      },
    }))
  }

  const handleFileUpload = (type: "passport" | "signature", file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      if (type === "passport") {
        setPassportFile(file)
        setPassportPreview(base64)
        handleInputChange("passportPhoto", base64)
      } else {
        setSignatureFile(file)
        setSignaturePreview(base64)
        handleInputChange("signature", base64)
      }
    }
    reader.readAsDataURL(file)
  }

  const generateMembershipId = () => {
    const prefix = "TVN"
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    return `${prefix}-${timestamp}-${random}`
  }

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleSubmit = async () => {
    const requiredFields = [
      "name", "dateOfBirth", "gender", "nationality", "stateOfOrigin", 
      "stateOfResidence", "phone", "community", "department", "userCategory",
      "currentEducationalLevel"
    ]
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof UserType])
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`)
      return
    }

    // Check conditional education fields
    if (formData.currentEducationalLevel === "Primary" || 
        formData.currentEducationalLevel === "Secondary" || 
        formData.currentEducationalLevel === "O'Level") {
      if (!formData.school) {
        toast.error("Please enter your school name")
        return
      }
    }

    if (formData.currentEducationalLevel === "OND" || 
        formData.currentEducationalLevel === "HND" || 
        formData.currentEducationalLevel === "Bachelor's Degree" ||
        formData.currentEducationalLevel === "Master's Degree" ||
        formData.currentEducationalLevel === "PhD" ||
        formData.currentEducationalLevel === "Professional Certification") {
      if (!formData.university) {
        toast.error("Please enter your university/institution name")
        return
      }
    }

    setIsSubmitting(true)

    try {
      const birthday = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().slice(5, 10) : ""

      // Map formData to Firebase schema
      const memberData = {
        // Personal Information
        name: formData.name || "",
        email: formData.email || "",
        dob: formData.dateOfBirth || "",
        birthday: birthday,
        gender: formData.gender || "",
        nationality: formData.nationality || "",
        nin: formData.nin || "",
        
        // Family Information
        family_size: formData.familySize?.toString() || "",
        family_position: formData.positionInFamily || "",
        
        // Education Information
        education_level: formData.currentEducationalLevel || "",
        school: formData.school || "",
        university: formData.university || "",
        
        // Location Information
        state_of_origin: formData.stateOfOrigin || "",
        lga_of_origin: formData.localGovernmentOfOrigin || "",
        state_of_residence: formData.stateOfResidence || "",
        lga_of_residence: formData.localGovernmentOfResidence || "",
        city_of_residence: formData.cityOfResidence || "",
        address: formData.address || "",
        
        // Church Information
        community: formData.community || "",
        department: formData.department || "",
        category: formData.userCategory || "",
        
        // Contact Information
        phone_number: formData.phone || "",
        phone_contact: formData.phone || "",
        guardian_contact: formData.nextOfKin?.phone || "",
        
        // Next of Kin
        next_of_kin: formData.nextOfKin ? JSON.stringify(formData.nextOfKin) : "",
        
        // Attachments & Security
        picture_url: formData.passportPhoto || "",
        fingerprint_data: formData.fingerprintCaptured ? "captured" : "",
        
        // Account Details
        account_details: "",
        
        // Role
        role: formData.role || "member",
      }

      const result = await createMember(memberData)
      
      toast.success("Member registration completed successfully!", {
        description: `Member ID: ${result.id}`,
      })

      if (onComplete) {
        onComplete({ ...formData, id: result.id })
      }

      // Reset form
      setFormData({
        role: "member",
        createdAt: new Date().toISOString(),
      })
      setCurrentStepIndex(0)
      setPassportPreview(null)
      setSignaturePreview(null)
      
    } catch (error: any) {
      console.error("Member registration error:", error)
      toast.error("Failed to register member", {
        description: error.message || "Please try again"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const goToNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const goToPrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
    "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
    "Yobe", "Zamfara"
  ]

  const educationLevels = [
    "None", "Primary", "Secondary", "O'Level", "OND", "HND", "Bachelor's Degree",
    "Master's Degree", "PhD", "Professional Certification"
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Stepper */}
      <Card className="shadow-lg border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStepIndex
              const isCompleted = index < currentStepIndex

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                        ${isActive 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30' 
                          : isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-slate-100 text-slate-400'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${isActive ? 'text-orange-600' : 'text-slate-600'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${index < currentStepIndex ? 'bg-green-500' : 'bg-slate-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="shadow-xl border-slate-200">
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentStep.title}</h2>
            <p className="text-slate-600">Please fill in the required information</p>
          </div>

          {/* User Category */}
          {currentStep.id === "category" && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200">
                <h3 className="font-semibold text-slate-900 mb-4 text-lg">Select Member Category</h3>
                <div className="space-y-2">
                  <Label htmlFor="userCategory" className="text-slate-700 font-medium">
                    User Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.userCategory || ""}
                    onValueChange={(value) => handleInputChange("userCategory", value)}
                  >
                    <SelectTrigger className="h-12 border-slate-300 bg-white">
                      <SelectValue placeholder="Select your category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="polished_pillars">Polished Pillars</SelectItem>
                      <SelectItem value="just_men">Just Men</SelectItem>
                      <SelectItem value="visionary_kids">Visionary Kids</SelectItem>
                      <SelectItem value="married_engaged">Married/Engaged</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-600 mt-2">Choose the category that best describes your membership</p>
                </div>
              </div>
            </div>
          )}

          {/* Personal Information */}
          {currentStep.id === "personal" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-slate-700 font-medium">Date of Birth <span className="text-red-500">*</span></Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth || ""}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-slate-700 font-medium">Gender <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.gender || ""}
                    onValueChange={(value) => handleInputChange("gender", value)}
                  >
                    <SelectTrigger className="h-11 border-slate-300">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality" className="text-slate-700 font-medium">Nationality <span className="text-red-500">*</span></Label>
                  <Input
                    id="nationality"
                    placeholder="e.g., Nigerian"
                    value={formData.nationality || ""}
                    onChange={(e) => handleInputChange("nationality", e.target.value)}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nin" className="text-slate-700 font-medium">National Identification Number (NIN)</Label>
                  <Input
                    id="nin"
                    placeholder="Enter NIN"
                    value={formData.nin || ""}
                    onChange={(e) => handleInputChange("nin", e.target.value)}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="familySize" className="text-slate-700 font-medium">Family Size</Label>
                  <Input
                    id="familySize"
                    type="number"
                    placeholder="Number of family members"
                    value={formData.familySize || ""}
                    onChange={(e) => handleInputChange("familySize", parseInt(e.target.value))}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="positionInFamily" className="text-slate-700 font-medium">Position in Family</Label>
                  <Input
                    id="positionInFamily"
                    placeholder="e.g., First Born, Second Child"
                    value={formData.positionInFamily || ""}
                    onChange={(e) => handleInputChange("positionInFamily", e.target.value)}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Education Information */}
          {currentStep.id === "education" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Highest Level of Education */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="educationLevel" className="text-slate-700 font-medium">
                    Highest Level of Education <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.currentEducationalLevel || ""}
                    onValueChange={(value) => handleInputChange("currentEducationalLevel", value)}
                  >
                    <SelectTrigger className="h-11 border-slate-300">
                      <SelectValue placeholder="Select your highest education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Conditional fields based on education level */}
                {formData.currentEducationalLevel && (
                  <>
                    {/* Show School Name for Primary/Secondary */}
                    {(formData.currentEducationalLevel === "Primary" || 
                      formData.currentEducationalLevel === "Secondary" || 
                      formData.currentEducationalLevel === "O'Level") && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="school" className="text-slate-700 font-medium">
                            School Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="school"
                            placeholder="Enter your school name"
                            value={formData.school || ""}
                            onChange={(e) => handleInputChange("school", e.target.value)}
                            className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="level" className="text-slate-700 font-medium">Current Class/Level</Label>
                          <Input
                            id="level"
                            placeholder="e.g., JSS1, SS2, Primary 4"
                            value={formData.level || ""}
                            onChange={(e) => handleInputChange("level", e.target.value)}
                            className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </>
                    )}

                    {/* Show University Name for Tertiary Education */}
                    {(formData.currentEducationalLevel === "OND" || 
                      formData.currentEducationalLevel === "HND" || 
                      formData.currentEducationalLevel === "Bachelor's Degree" ||
                      formData.currentEducationalLevel === "Master's Degree" ||
                      formData.currentEducationalLevel === "PhD" ||
                      formData.currentEducationalLevel === "Professional Certification") && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="university" className="text-slate-700 font-medium">
                            University/Institution Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="university"
                            placeholder="Enter your university/institution name"
                            value={formData.university || ""}
                            onChange={(e) => handleInputChange("university", e.target.value)}
                            className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="level" className="text-slate-700 font-medium">Current Level/Year</Label>
                          <Input
                            id="level"
                            placeholder="e.g., 100 Level, 200 Level, Year 1"
                            value={formData.level || ""}
                            onChange={(e) => handleInputChange("level", e.target.value)}
                            className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {!formData.currentEducationalLevel && (
                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <p className="text-sm text-slate-600">
                    Please select your highest level of education to continue
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Location Information */}
          {currentStep.id === "location" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stateOfOrigin" className="text-slate-700 font-medium">State of Origin <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.stateOfOrigin || ""}
                    onValueChange={(value) => handleInputChange("stateOfOrigin", value)}
                  >
                    <SelectTrigger className="h-11 border-slate-300">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {nigerianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lgaOfOrigin" className="text-slate-700 font-medium">Local Government of Origin</Label>
                  <Input
                    id="lgaOfOrigin"
                    placeholder="Enter LGA"
                    value={formData.localGovernmentOfOrigin || ""}
                    onChange={(e) => handleInputChange("localGovernmentOfOrigin", e.target.value)}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stateOfResidence" className="text-slate-700 font-medium">State of Residence <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.stateOfResidence || ""}
                    onValueChange={(value) => handleInputChange("stateOfResidence", value)}
                  >
                    <SelectTrigger className="h-11 border-slate-300">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {nigerianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lgaOfResidence" className="text-slate-700 font-medium">Local Government of Residence</Label>
                  <Input
                    id="lgaOfResidence"
                    placeholder="Enter LGA"
                    value={formData.localGovernmentOfResidence || ""}
                    onChange={(e) => handleInputChange("localGovernmentOfResidence", e.target.value)}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cityOfResidence" className="text-slate-700 font-medium">City of Residence</Label>
                  <Input
                    id="cityOfResidence"
                    placeholder="Enter city"
                    value={formData.cityOfResidence || ""}
                    onChange={(e) => handleInputChange("cityOfResidence", e.target.value)}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-slate-700 font-medium">Residential Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter full address"
                    value={formData.address || ""}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Church Information */}
          {currentStep.id === "church" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="community" className="text-slate-700 font-medium">Community at The Visionary Nation <span className="text-red-500">*</span></Label>
                  <Input
                    id="community"
                    placeholder="e.g., Youth Community, Adult Community"
                    value={formData.community || ""}
                    onChange={(e) => handleInputChange("community", e.target.value)}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-slate-700 font-medium">Department <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.department || ""}
                    onValueChange={(value) => handleInputChange("department", value)}
                  >
                    <SelectTrigger className="h-11 border-slate-300">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="choir">Choir</SelectItem>
                      <SelectItem value="ushering">Ushering</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="protocol">Protocol</SelectItem>
                      <SelectItem value="welfare">Welfare</SelectItem>
                      <SelectItem value="prayer">Prayer Team</SelectItem>
                      <SelectItem value="stewards">Stewards</SelectItem>
                      <SelectItem value="children">Children Ministry</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Stewards Department - Only show if Stewards is selected */}
              {formData.department === "stewards" && (
                <div className="p-6 rounded-xl bg-gradient-to-r from-green-50 to-white border border-green-200">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Church className="w-5 h-5 text-green-600" />
                    Stewards Department Information
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="stewardsDepartment" className="text-slate-700 font-medium">
                      Stewards Department <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.stewardsDepartment || ""}
                      onValueChange={(value) => handleInputChange("stewardsDepartment", value)}
                    >
                      <SelectTrigger className="h-11 border-slate-300 bg-white">
                        <SelectValue placeholder="Select stewards department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="altar">Altar Stewards</SelectItem>
                        <SelectItem value="sanctuary">Sanctuary Care</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="cleaning">Cleaning Team</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contact Information */}
          {currentStep.id === "contact" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 xxx xxx xxxx"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianContact" className="text-slate-700 font-medium">Guardian/Parent Contact</Label>
                  <Input
                    id="guardianContact"
                    type="tel"
                    placeholder="+234 xxx xxx xxxx"
                    value={formData.guardianOrParentContact || ""}
                    onChange={(e) => handleInputChange("guardianOrParentContact", e.target.value)}
                    className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Next of Kin */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-600" />
                  Next of Kin Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="kinName" className="text-slate-700 font-medium">Full Name</Label>
                    <Input
                      id="kinName"
                      placeholder="Full name"
                      value={formData.nextOfKin?.name || ""}
                      onChange={(e) => handleNestedInputChange("nextOfKin", "name", e.target.value)}
                      className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kinRelationship" className="text-slate-700 font-medium">Relationship</Label>
                    <Input
                      id="kinRelationship"
                      placeholder="e.g., Spouse, Parent, Sibling"
                      value={formData.nextOfKin?.relationship || ""}
                      onChange={(e) => handleNestedInputChange("nextOfKin", "relationship", e.target.value)}
                      className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kinPhone" className="text-slate-700 font-medium">Phone Number</Label>
                    <Input
                      id="kinPhone"
                      type="tel"
                      placeholder="+234 xxx xxx xxxx"
                      value={formData.nextOfKin?.phone || ""}
                      onChange={(e) => handleNestedInputChange("nextOfKin", "phone", e.target.value)}
                      className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kinAddress" className="text-slate-700 font-medium">Address</Label>
                    <Input
                      id="kinAddress"
                      placeholder="Full address"
                      value={formData.nextOfKin?.address || ""}
                      onChange={(e) => handleNestedInputChange("nextOfKin", "address", e.target.value)}
                      className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-purple-50 to-white border border-purple-200">
                <h3 className="font-semibold text-slate-900 mb-4">Bank Account Details (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="text-slate-700 font-medium">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="Enter bank name"
                      value={formData.accountDetails?.bankName || ""}
                      onChange={(e) => handleNestedInputChange("accountDetails", "bankName", e.target.value)}
                      className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="text-slate-700 font-medium">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="10-digit account number"
                      value={formData.accountDetails?.accountNumber || ""}
                      onChange={(e) => handleNestedInputChange("accountDetails", "accountNumber", e.target.value)}
                      className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="accountName" className="text-slate-700 font-medium">Account Name</Label>
                    <Input
                      id="accountName"
                      placeholder="Account holder name"
                      value={formData.accountDetails?.accountName || ""}
                      onChange={(e) => handleNestedInputChange("accountDetails", "accountName", e.target.value)}
                      className="h-11 border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attachments */}
          {currentStep.id === "attachments" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Passport Photo */}
                <div className="space-y-3">
                  <Label className="text-slate-700 font-medium">Passport Photograph <span className="text-red-500">*</span></Label>
                  <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-orange-500 transition-colors bg-gradient-to-br from-slate-50 to-white">
                    {passportPreview ? (
                      <div className="space-y-3">
                        <img
                          src={passportPreview}
                          alt="Passport"
                          className="w-32 h-32 mx-auto object-cover rounded-xl shadow-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => passportInputRef.current?.click()}
                          className="border-orange-500 text-orange-600 hover:bg-orange-50"
                        >
                          Change Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-orange-600" />
                        </div>
                        <p className="text-sm text-slate-600 font-medium">Upload passport photo</p>
                        <Button
                          variant="outline"
                          onClick={() => passportInputRef.current?.click()}
                          className="border-orange-500 text-orange-600 hover:bg-orange-50"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Select Photo
                        </Button>
                      </div>
                    )}
                    <input
                      ref={passportInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload("passport", file)
                      }}
                    />
                  </div>
                </div>

                {/* Signature */}
                <div className="space-y-3">
                  <Label className="text-slate-700 font-medium">Signature <span className="text-red-500">*</span></Label>
                  <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-purple-500 transition-colors bg-gradient-to-br from-slate-50 to-white">
                    {signaturePreview ? (
                      <div className="space-y-3">
                        <img
                          src={signaturePreview}
                          alt="Signature"
                          className="w-full h-32 mx-auto object-contain rounded-xl bg-white shadow-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => signatureInputRef.current?.click()}
                          className="border-purple-500 text-purple-600 hover:bg-purple-50"
                        >
                          Change Signature
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
                          <FileSignature className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-sm text-slate-600 font-medium">Upload signature</p>
                        <Button
                          variant="outline"
                          onClick={() => signatureInputRef.current?.click()}
                          className="border-purple-500 text-purple-600 hover:bg-purple-50"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Select Signature
                        </Button>
                      </div>
                    )}
                    <input
                      ref={signatureInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload("signature", file)
                      }}
                    />
                  </div>
                </div>

                {/* Fingerprint for Stewards */}
                {formData.department === "stewards" && (
                  <div className="space-y-3 md:col-span-2">
                    <Label className="text-slate-700 font-medium">Fingerprint Capture (Stewards Only) <span className="text-red-500">*</span></Label>
                    <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-green-500 transition-colors bg-gradient-to-br from-green-50 to-white">
                      <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                          <Fingerprint className="w-10 h-10 text-green-600" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-900 mb-2">Biometric Fingerprint</p>
                          <p className="text-sm text-slate-600 mb-4">
                            As a steward, your fingerprint will be captured for attendance tracking and security purposes
                          </p>
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                          <Button
                            type="button"
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                            onClick={() => {
                              // In production, integrate with biometric device
                              handleInputChange("fingerprintCaptured", true)
                              toast.success("Fingerprint captured successfully!")
                            }}
                          >
                            <Fingerprint className="w-5 h-5 mr-2" />
                            Capture Fingerprint
                          </Button>
                          {formData.fingerprintCaptured && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="font-medium">Fingerprint Captured</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
            {currentStepIndex > 0 && (
              <Button
                variant="outline"
                onClick={goToPrevious}
                className="flex-1 h-12 border-slate-300 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            
            {currentStepIndex < steps.length - 1 ? (
              <Button
                onClick={goToNext}
                className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {isSubmitting ? "Registering..." : "Complete Registration"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
