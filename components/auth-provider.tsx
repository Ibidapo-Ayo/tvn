"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/types/types"

// Mock authentication context - in production, integrate with Supabase Auth
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session on mount with error handling
    try {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("Error loading saved user:", error)
      // Clear corrupted data
      localStorage.removeItem("user")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login - replace with actual Supabase authentication
      if (email === "admin@example.com" && password === "admin123") {
        const mockUser: User = {
          id: "1",
          email,
          name: "Admin User",
          role: "admin",
          createdAt: new Date().toISOString(),
          age: 0,
          gender: "male",
          dateOfBirth: "",
          birthday: "",
          nationality: "",
          stateOfOrigin: "",
          localGovernmentOfOrigin: "",
          stateOfResidence: "",
          localGovernmentOfResidence: "",
          cityOfResidence: "",
          address: "",
          positionInFamily: "",
          familySize: 0,
          currentEducationalLevel: "",
          community: "",
          department: "",
          phone: "",
          nextOfKin: {
            name: "",
            relationship: "",
            phone: "",
            address: undefined
          }
        }
        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    try {
      setUser(null)
      localStorage.removeItem("user")
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
