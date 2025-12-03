"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Users,
  UserCheck,
  Search,
  ClipboardList,
  Star,
} from "lucide-react"
import { toast } from "sonner"

interface AttendanceMember {
  id: string
  membershipId: string
  name: string
  email: string
  phone: string
}

interface AttendanceEvent {
  id: string
  title: string
  date: string
  time: string
  type: "sunday_service" | "midweek" | "special" | "other"
}

interface AttendanceRecord {
  membershipId: string
  name: string
  email: string
  phone: string
  markedAt: string
}

const sampleEvents: AttendanceEvent[] = [
  {
    id: "evt-001",
    title: "Sunday Sunrise Service",
    date: "2025-01-19",
    time: "07:30 AM",
    type: "sunday_service",
  },
  {
    id: "evt-002",
    title: "Midweek Prayer Meeting",
    date: "2025-01-22",
    time: "06:00 PM",
    type: "midweek",
  },
  {
    id: "evt-003",
    title: "Youth Focus Hangout",
    date: "2025-01-25",
    time: "11:00 AM",
    type: "special",
  },
]

const sampleMembers: AttendanceMember[] = [
  {
    id: "mem-001",
    membershipId: "TVN-003241",
    name: "Chinaza Obi",
    email: "chinaza@tvn.app",
    phone: "+234 802 123 4567",
  },
  {
    id: "mem-002",
    membershipId: "TVN-004102",
    name: "David Okafor",
    email: "david@tvn.app",
    phone: "+234 701 800 2200",
  },
  {
    id: "mem-003",
    membershipId: "TVN-002887",
    name: "Ifeoma Nwachukwu",
    email: "ifeoma@tvn.app",
    phone: "+234 705 110 4455",
  },
  {
    id: "mem-004",
    membershipId: "TVN-005510",
    name: "Michael Onoja",
    email: "michael@tvn.app",
    phone: "+234 803 900 1234",
  },
]

export function AttendanceTracking() {
  const [events] = useState(sampleEvents)
  const [members] = useState(sampleMembers)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    sampleEvents[0]?.id ?? null
  )
  const [membershipSearch, setMembershipSearch] = useState("")
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord[]>>({})

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId]
  )

  const filteredMembers = useMemo(() => {
    const query = membershipSearch.trim().toLowerCase()
    if (!query) return members

    return members.filter((member) =>
      member.membershipId.toLowerCase().includes(query)
    )
  }, [members, membershipSearch])

  const currentAttendance = selectedEventId
    ? attendanceMap[selectedEventId] ?? []
    : []

  const alreadyMarked = (member: AttendanceMember) =>
    currentAttendance.some((record) => record.membershipId === member.membershipId)

  const handleMarkAttendance = (member: AttendanceMember) => {
    if (!selectedEventId || !selectedEvent) {
      toast.error("Select an event before marking attendance")
      return
    }

    setAttendanceMap((prev) => {
      const existing = prev[selectedEventId] ?? []
      if (existing.some((record) => record.membershipId === member.membershipId)) {
        toast.warning(`${member.name} is already marked present`)
        return prev
      }

      const updated: AttendanceRecord[] = [
        ...existing,
        {
          membershipId: member.membershipId,
          name: member.name,
          email: member.email,
          phone: member.phone,
          markedAt: new Date().toISOString(),
        },
      ]

      toast.success(`${member.name} has been marked present`)
      return { ...prev, [selectedEventId]: updated }
    })
  }

  const attendanceStats = useMemo(() => {
    if (!selectedEventId) return { total: 0, unique: 0 }
    const records = attendanceMap[selectedEventId] ?? []
    return { total: records.length, unique: records.length }
  }, [attendanceMap, selectedEventId])

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-lg">
        <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900 to-slate-950 opacity-90" />
        <div className="relative grid gap-8 p-8 lg:grid-cols-[minmax(0,3fr)_360px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
              Quick Attendance
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white lg:text-4xl">
              Mark attendance without breaking conversation
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/70">
              Pick an event, scan or type their membership ID, and log their presence. Each mark saves full member context so you never double count or lose history.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 shadow-inner shadow-black/30">
                <p className="text-xs uppercase tracking-wide text-white/60">
                  Selected event
                </p>
                <p className="text-lg font-semibold text-white">
                  {selectedEvent?.title ?? "None"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 shadow-inner shadow-black/30">
                <p className="text-xs uppercase tracking-wide text-white/60">
                  Marked today
                </p>
                <p className="text-lg font-semibold text-white">
                  {attendanceStats.total}
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 shadow-inner shadow-black/30">
                <p className="text-xs uppercase tracking-wide text-white/60">
                  Unique scans
                </p>
                <p className="text-lg font-semibold text-white">
                  {attendanceStats.unique}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
              Event selector
            </p>
            <p className="mt-2 text-base text-white/80">
              Switch events in one click to keep the roster synced.
            </p>

            <div className="mt-6 w-full">
              <label className="mb-2 flex items-center gap-2 text-white/80 font-bold text-sm uppercase tracking-widest">
                <Calendar className="w-4 h-4 text-orange-400" />
                Select Event
              </label>
              <div className="relative w-full max-w-full">
                <Select
                  value={selectedEventId ?? ""}
                  onValueChange={(value) => setSelectedEventId(value)}
                >
                  <SelectTrigger className="h-14 w-full rounded-xl border-2 border-orange-400/20 bg-gradient-to-r from-slate-900/80 to-orange-900/30 hover:border-orange-500 transition-colors duration-200 font-semibold text-white text-base pl-5 pr-10 shadow-md focus:ring-2 focus:ring-orange-400 max-w-full overflow-hidden min-w-0">
                    <div className="flex items-center gap-3 w-full min-w-0 overflow-hidden">
                      <Calendar className="w-5 h-5 text-orange-400 shrink-0" />
                      <div className="flex-1 min-w-0 truncate">
                        {selectedEvent
                          ? (
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-white truncate max-w-[210px] sm:max-w-[320px]">
                                {selectedEvent.title}
                              </span>
                              <span className="text-xs text-orange-200 mt-0.5 truncate max-w-[210px] sm:max-w-[320px]">
                                {selectedEvent.date} • {selectedEvent.time}
                              </span>
                            </div>
                          )
                          : <span className="text-white/60">Pick an event to begin</span>
                        }
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent
                    align="start"
                    sideOffset={2}
                    className="rounded-xl shadow-2xl p-2 bg-white w-full min-w-[220px] max-w-[95vw] border-0 box-border"
                    style={{ width: "100%" }}
                  >
                    <div className="max-h-72 overflow-auto custom-scrollbar pr-1">
                      {events.length === 0 ? (
                        <div className="px-4 py-8 text-center text-slate-400 text-base font-medium">
                          No events to select.
                        </div>
                      ) : (
                        events.map((event) => (
                          <SelectItem
                            key={event.id}
                            value={event.id}
                            className="rounded-lg px-4 py-3 mb-1 cursor-pointer transition-colors duration-100 hover:bg-orange-50/70 break-words"
                          >
                            <div className="flex items-center gap-2 w-full min-w-0">
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[350px]">
                                  {event.title}
                                </span>
                                <span className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px] sm:max-w-[350px]">
                                  {event.date} • {event.time}
                                </span>
                              </div>
                              <span className="ml-4 shrink-0 rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-orange-700 uppercase">
                                {event.type.replace("_", " ")}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </div>
                  </SelectContent>
                </Select>
                {!selectedEventId && (
                  <span className="absolute right-4 top-3 text-xs text-orange-300 animate-bounce pointer-events-none">
                    &larr; Choose
                  </span>
                )}
              </div>
            </div>

            {selectedEvent && (
              <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-orange-300" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/60">
                      Schedule
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {selectedEvent.date} • {selectedEvent.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-purple-300" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/60">
                      Type
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {selectedEvent.type.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/60">
                      Latest mark
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {currentAttendance[0]?.name ?? "No one yet"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="border-b border-slate-100 pb-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">
                  Scan or search members
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Works with scanners or manual entry. Type in the membership ID and press enter to focus the match.
                </p>
              </div>
              <Badge variant="outline" className="rounded-full text-slate-600">
                {filteredMembers.length} available
              </Badge>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                value={membershipSearch}
                onChange={(event) => setMembershipSearch(event.target.value)}
                placeholder="Membership ID e.g. TVN-003241"
                className="h-12 rounded-2xl border border-slate-300 bg-white pl-12 text-base shadow-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {filteredMembers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <ClipboardList className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-700">
                  No members match that ID
                </p>
                <p className="text-xs text-slate-500">
                  Re-check the digits or clear the search field.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <TableHead>Membership ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id} className="text-sm">
                        <TableCell className="font-semibold text-slate-900">
                          {member.membershipId}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {member.name}
                            </span>
                            <span className="text-xs text-slate-500">
                              {member.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-slate-600">
                          {member.phone}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            className="rounded-xl bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-sm"
                            disabled={alreadyMarked(member)}
                            onClick={() => handleMarkAttendance(member)}
                          >
                            {alreadyMarked(member) ? (
                              "Marked"
                            ) : (
                              <>
                                <UserCheck className="mr-1 h-4 w-4" />
                                Mark
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">
                  Live attendance log
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Everyone marked present for {selectedEvent?.title ?? "the event"}.
                </p>
              </div>
              <Badge variant="outline" className="rounded-full text-slate-600">
                {currentAttendance.length} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentAttendance.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <ClipboardList className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-700">
                  No attendance recorded
                </p>
                <p className="text-xs text-slate-500">
                  Use the member table to log the first arrival.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentAttendance.map((record) => (
                  <div
                    key={record.membershipId}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {record.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {record.email} • {record.phone}
                        </p>
                      </div>
                      <Badge variant="outline" className="rounded-full text-xs">
                        {record.membershipId}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Marked at{" "}
                      {new Date(record.markedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
