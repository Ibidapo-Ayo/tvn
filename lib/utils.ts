import { Member } from "@/types/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum FormFieldTypes {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  PHONE_INPUT = "phoneInput",
}

export const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return "N/A"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export const checkMembersBirthday = (dob: string) => {
  const today = new Date()
  const birthDate = new Date(dob)
  const age = today.getFullYear() - birthDate.getFullYear()
  return age
}

export const getUpcomingMembersBirthday = (dob: string) => {
  const birthDate = new Date(dob)
  const today = new Date()

  if (Number.isNaN(birthDate.getTime())) {
    return today
  }

  const upcomingBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  )

  // If birthday already happened this year, move to next year
  if (upcomingBirthday < today) {
    upcomingBirthday.setFullYear(upcomingBirthday.getFullYear() + 1)
  }

  return upcomingBirthday
}

export const upcomingBirthdaysMembers = (
  members: Member[] = [],
  daysWindow = 14,
  limit = 5
) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const futureDate = new Date(today)
  futureDate.setDate(futureDate.getDate() + daysWindow)

  return members
    .filter((member) => member.dob)
    .map((member) => ({
      member,
      upcomingDate: getUpcomingMembersBirthday(member.dob as string),
    }))
    .filter(
      ({ upcomingDate }) => upcomingDate >= today && upcomingDate <= futureDate
    )
    .sort(
      (a, b) => a.upcomingDate.getTime() - b.upcomingDate.getTime()
    )
    .slice(0, limit)
    .map(({ member }) => member)
}

export const getNextMemberBirthday = (
  members: Member[]
): { nextMemberBirthday: Member[]; nextBirthdayText: string } => {
  if (!members || members.length === 0) {
    return {
      nextMemberBirthday: [],
      nextBirthdayText: "No upcoming birthdays",
    }
  }

  const sortedMembers = [...members].sort(
    (a, b) =>
      getUpcomingMembersBirthday(a.dob as string).getTime() -
      getUpcomingMembersBirthday(b.dob as string).getTime()
  )

  const nextBirthdayDate = getUpcomingMembersBirthday(
    sortedMembers[0].dob as string
  )

  const daysToGo = Math.ceil(
    (nextBirthdayDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  )

  let nextBirthdayText = ""
  if (daysToGo > 0) {
    nextBirthdayText = `${daysToGo} day${daysToGo === 1 ? "" : "s"} to go`
  } else {
    nextBirthdayText = "Today"
  }

  return {
    nextMemberBirthday: sortedMembers,
    nextBirthdayText,
  }
}
