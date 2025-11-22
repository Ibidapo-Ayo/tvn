"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { Mail, Lock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import CustomInput from "@/components/input/CustomInput"
import { FormFieldTypes } from "@/lib/utils"
import { loginFormSchema, type LoginFormValues } from "@/lib/validations"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)

    try {
      const success = await login(data.email, data.password)
      if (success) {
        toast.success("Welcome to The Visionary Nation")
        router.push("/dashboard")
      } else {
        toast.error("Invalid email or password. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <CustomInput
          control={form.control}
          fieldType={FormFieldTypes.INPUT}
          name="email"
          type="email"
          label="Email"
          placeholder="your.email@example.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomInput
          control={form.control}
          fieldType={FormFieldTypes.INPUT}
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          iconSrc="/assets/icons/lock.svg"
          iconAlt="password"
        />

      <Button
        type="submit"
          className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold mt-6 rounded-xl shadow-lg"
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
    </Form>
  )
}
