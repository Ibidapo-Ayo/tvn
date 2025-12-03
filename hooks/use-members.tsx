"use client"

import { useMemo } from "react"
import { Member } from "@/types/types"

type CreateMemberPayload = Omit<Member, "id">

interface UseMembersResult {
  getAllMembers: () => Promise<Member[]>
  getRecentMembers: (limit?: number) => Promise<Member[]>
  createMember: (memberData: CreateMemberPayload) => Promise<Member>
  updateMember: (memberId: string, memberData: Partial<Member>) => Promise<void>
  deleteMember: (memberId: string) => Promise<void>
}

const warn = (method: string) => {
  console.warn(
    `[useMembers] ${method} is not implemented. Please connect this hook to your data source.`
  )
}

export function useMembers(): UseMembersResult {
  return useMemo(
    () => ({
    async getAllMembers() {
      warn("getAllMembers")
      return []
    },
    async getRecentMembers() {
      warn("getRecentMembers")
      return []
    },
    async createMember() {
      warn("createMember")
      throw new Error("createMember is not implemented")
    },
    async updateMember() {
      warn("updateMember")
      throw new Error("updateMember is not implemented")
    },
    async deleteMember() {
      warn("deleteMember")
      throw new Error("deleteMember is not implemented")
    },
    }),
    []
  )
}

