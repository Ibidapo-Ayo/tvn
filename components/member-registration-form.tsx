"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { User, MapPin, Briefcase, Phone, Building2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import CustomInput from "@/components/input/CustomInput"
import { FormFieldTypes } from "@/lib/utils"
import { memberRegistrationSchema, type MemberRegistrationValues } from "@/lib/validations"
import { useMembers } from "@/hooks/use-members"
import { useMembersContext } from "@/contexts/members-context"
import { useRouter } from "next/navigation"
import { SelectItem } from "@/components/ui/select"

const steps = [
  { id: 1, title: "Personal Information", icon: User },
  { id: 2, title: "Location Details", icon: MapPin },
  { id: 3, title: "Family & Education", icon: Briefcase },
  { id: 4, title: "Contact & Next of Kin", icon: Phone },
  { id: 5, title: "Bank Details (Optional)", icon: Building2 },
]

export function MemberRegistrationForm() {
  const router = useRouter()
  const { createMember } = useMembers()
  const { refreshMemberCounts } = useMembersContext()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<MemberRegistrationValues>({
    resolver: zodResolver(memberRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      dob: "",
      gender: "",
      nationality: "Nigeria",
      nin: "",
      state_of_origin: "",
      state_of_residence: "",
      lga: "",
      city_of_residence: "",
      residential_address: "",
      family_size: 1,
      position_in_family: "",
      highest_level_of_education: "",
      phone_number: "",
      g_phone_number: "",
      user_category: "",
      next_of_kin: {
        name: "",
        relationship: "",
        phone: "",
        address: "",
      },
      bank_details: {
        account_name: "",
        account_number: "",
        bank_name: "",
      },
      passport_photo_url: "",
    },
  })

  const onSubmit = async (data: MemberRegistrationValues) => {
    try {
      setIsSubmitting(true)
      
      // Convert date to ISO string if it's a Date object
      const dobValue = data.dob instanceof Date 
        ? data.dob.toISOString() 
        : data.dob

      const memberData = {
        ...data,
        dob: dobValue,
        createdAt: new Date().toISOString(),
      }

        await createMember(memberData as any)
      
      // Refresh member counts in sidebar immediately
      await refreshMemberCounts()
      
      toast.success("Member registered successfully!")
      form.reset()
      setCurrentStep(1)
      
      // Optionally redirect to members list
      setTimeout(() => {
        router.push("/dashboard/users")
      }, 1500)
    } catch (error) {
      console.error("Failed to register member:", error)
      toast.error("Failed to register member. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await form.trigger(fieldsToValidate as any)
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ["name", "email", "dob", "gender", "nationality", "nin"]
      case 2:
        return ["state_of_origin", "state_of_residence", "lga", "city_of_residence", "residential_address"]
      case 3:
        return ["family_size", "position_in_family", "highest_level_of_education"]
      case 4:
        return ["phone_number", "g_phone_number", "user_category"]
      case 5:
        return []
      default:
        return []
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                    ${
                      currentStep > step.id
                        ? "bg-green-500 text-white"
                        : currentStep === step.id
                        ? "bg-orange-500 text-white ring-4 ring-orange-100"
                        : "bg-slate-200 text-slate-400"
                    }
                  `}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`
                    text-xs mt-2 text-center font-medium
                    ${
                      currentStep >= step.id
                        ? "text-slate-900"
                        : "text-slate-400"
                    }
                  `}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    h-1 flex-1 transition-all duration-300 mx-2
                    ${currentStep > step.id ? "bg-green-500" : "bg-slate-200"}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <Card className="shadow-xl border-slate-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-purple-50 border-b">
          <CardTitle className="text-2xl">
            Step {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <CustomInput
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="Enter full name"
                    fieldType={FormFieldTypes.INPUT}
                    type="text"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      control={form.control}
                      name="email"
                      label="Email Address (Optional)"
                      placeholder="email@example.com"
                      fieldType={FormFieldTypes.INPUT}
                      type="email"
                    />

                    <CustomInput
                      control={form.control}
                      name="dob"
                      label="Date of Birth"
                      fieldType={FormFieldTypes.DATE_PICKER}
                      dateFormat="dd/MM/yyyy"
                      showTimeSelect={false}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      control={form.control}
                      name="gender"
                      label="Gender"
                      placeholder="Select gender"
                      fieldType={FormFieldTypes.SELECT}
                    >
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </CustomInput>

                    <CustomInput
                      control={form.control}
                      name="nationality"
                      label="Nationality"
                      placeholder="Enter nationality"
                      fieldType={FormFieldTypes.INPUT}
                      type="text"
                    />
                  </div>

                  <CustomInput
                    control={form.control}
                    name="nin"
                    label="NIN (National Identification Number - Optional)"
                    placeholder="Enter NIN"
                    fieldType={FormFieldTypes.INPUT}
                    type="text"
                  />
                </div>
              )}

              {/* Step 2: Location Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      control={form.control}
                      name="state_of_origin"
                      label="State of Origin"
                      placeholder="Enter state of origin"
                      fieldType={FormFieldTypes.INPUT}
                      type="text"
                    />

                    <CustomInput
                      control={form.control}
                      name="state_of_residence"
                      label="State of Residence"
                      placeholder="Enter state of residence"
                      fieldType={FormFieldTypes.INPUT}
                      type="text"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      control={form.control}
                      name="lga"
                      label="Local Government Area (LGA)"
                      placeholder="Enter LGA"
                      fieldType={FormFieldTypes.INPUT}
                      type="text"
                    />

                    <CustomInput
                      control={form.control}
                      name="city_of_residence"
                      label="City of Residence"
                      placeholder="Enter city"
                      fieldType={FormFieldTypes.INPUT}
                      type="text"
                    />
                  </div>

                  <CustomInput
                    control={form.control}
                    name="residential_address"
                    label="Residential Address"
                    placeholder="Enter full residential address"
                    fieldType={FormFieldTypes.TEXTAREA}
                  />
                </div>
              )}

              {/* Step 3: Family & Education */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      control={form.control}
                      name="family_size"
                      label="Family Size"
                      placeholder="Enter family size"
                      fieldType={FormFieldTypes.INPUT}
                      type="number"
                    />

                    <CustomInput
                      control={form.control}
                      name="position_in_family"
                      label="Position in Family"
                      placeholder="e.g., 1st child, 2nd child"
                      fieldType={FormFieldTypes.INPUT}
                      type="text"
                    />
                  </div>

                  <CustomInput
                    control={form.control}
                    name="highest_level_of_education"
                    label="Highest Level of Education"
                    placeholder="Select education level"
                    fieldType={FormFieldTypes.SELECT}
                  >
                    <SelectItem value="Primary">Primary</SelectItem>
                    <SelectItem value="Secondary">Secondary</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="University">University</SelectItem>
                    <SelectItem value="Masters">Masters</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </CustomInput>
                </div>
              )}

              {/* Step 4: Contact & Next of Kin */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CustomInput
                        control={form.control}
                        name="phone_number"
                        label="Phone Number"
                        placeholder="+234"
                        fieldType={FormFieldTypes.PHONE_INPUT}
                      />

                      <CustomInput
                        control={form.control}
                        name="g_phone_number"
                        label="Guardian Phone Number (Optional)"
                        placeholder="+234"
                        fieldType={FormFieldTypes.PHONE_INPUT}
                      />
                    </div>

                    <CustomInput
                      control={form.control}
                      name="user_category"
                      label="Church Category (Optional)"
                      placeholder="Select category"
                      fieldType={FormFieldTypes.SELECT}
                    >
                      <SelectItem value="Just men">Just Men</SelectItem>
                      <SelectItem value="Polished Pillars">Polished Pillars</SelectItem>
                      <SelectItem value="Visionary Kids">Visionary Kids</SelectItem>
                      <SelectItem value="Married/Engaged">Married/Engaged</SelectItem>
                    </CustomInput>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold text-slate-900">Next of Kin (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CustomInput
                        control={form.control}
                        name="next_of_kin.name"
                        label="Name"
                        placeholder="Next of kin name"
                        fieldType={FormFieldTypes.INPUT}
                        type="text"
                      />

                      <CustomInput
                        control={form.control}
                        name="next_of_kin.relationship"
                        label="Relationship"
                        placeholder="e.g., Father, Mother, Spouse"
                        fieldType={FormFieldTypes.INPUT}
                        type="text"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CustomInput
                        control={form.control}
                        name="next_of_kin.phone"
                        label="Phone Number"
                        placeholder="+234"
                        fieldType={FormFieldTypes.PHONE_INPUT}
                      />

                      <CustomInput
                        control={form.control}
                        name="next_of_kin.address"
                        label="Address"
                        placeholder="Next of kin address"
                        fieldType={FormFieldTypes.INPUT}
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Bank Details */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      Bank details are optional but helpful for church financial transactions.
                    </p>
                  </div>

                  <CustomInput
                    control={form.control}
                    name="bank_details.account_name"
                    label="Account Name"
                    placeholder="Enter account name"
                    fieldType={FormFieldTypes.INPUT}
                    type="text"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      control={form.control}
                      name="bank_details.account_number"
                      label="Account Number"
                      placeholder="Enter account number"
                      fieldType={FormFieldTypes.INPUT}
                      type="text"
                    />

                    <CustomInput
                      control={form.control}
                      name="bank_details.bank_name"
                      label="Bank Name"
                      placeholder="Enter bank name"
                      fieldType={FormFieldTypes.INPUT}
                      type="text"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1 || isSubmitting}
                  className="min-w-[120px]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={isSubmitting}
                    className="min-w-[120px] bg-orange-500 hover:bg-orange-600"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[120px] bg-green-500 hover:bg-green-600"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Submit
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

