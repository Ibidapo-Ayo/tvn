"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react"
import { useMembers } from "@/hooks/use-members"
import { Member } from "@/types/types"
import { upcomingBirthdaysMembers } from "@/lib/utils"

interface MembersContextType {
  totalMembersCount: number
  recentMembersCount: number
  refreshMemberCounts: () => Promise<void>
  isLoading: boolean
  members: Member[]
  upcomingBirthdaysMembersList: Member[]
}

const MembersContext = createContext<MembersContextType | undefined>(undefined)

export function MembersProvider({ children }: { children: React.ReactNode }) {
  const membersHook = useMembers()
  const [totalMembersCount, setTotalMembersCount] = useState(0)
  const [recentMembersCount, setRecentMembersCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [members, setMembers] = useState<Member[]>([])
  const [upcomingBirthdaysMembersList, setUpcomingBirthdaysMembersList] =
    useState<Member[]>([])
  const mountedRef = useRef(true)
  const membersHookRef = useRef(membersHook)

  useEffect(() => {
    membersHookRef.current = membersHook
  }, [membersHook])

  const refreshMemberCounts = useCallback(async () => {
    try {
      setIsLoading(true)
      const allMembers = await membersHookRef.current.getAllMembers()

      if (!mountedRef.current) return

      const totalCount = allMembers.length
      const recentCount = allMembers.filter((member) => {
        if (!member.createdAt) return false
        const createdDate = new Date(member.createdAt)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return createdDate >= thirtyDaysAgo
      }).length

      setTotalMembersCount(totalCount)
      setRecentMembersCount(recentCount)
      setMembers(allMembers)
      setUpcomingBirthdaysMembersList(upcomingBirthdaysMembers(allMembers))
    } catch (error) {
      console.error("❌ Failed to fetch member counts:", error)
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    refreshMemberCounts()

    return () => {
      mountedRef.current = false
    }
  }, [refreshMemberCounts])

  return (
    <MembersContext.Provider
      value={{
        totalMembersCount,
        recentMembersCount,
        refreshMemberCounts,
        isLoading,
        members,
        upcomingBirthdaysMembersList,
      }}
    >
      {children}
    </MembersContext.Provider>
  )
}

export function useMembersContext() {
  const context = useContext(MembersContext)
  if (context === undefined) {
    throw new Error("useMembersContext must be used within a MembersProvider")
  }
  return context
}

