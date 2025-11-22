"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MoreVertical, Edit, Trash2, Eye, UserPlus, Download, Filter } from "lucide-react"
import { toast } from "sonner"
import { useMembers } from "@/hooks/use-members"
import { useMembersContext } from "@/contexts/members-context"
import { Member } from "@/types/types"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function MembersList() {
  const router = useRouter()
  const { deleteMember } = useMembers()
  const {
    members: contextMembers,
    refreshMemberCounts,
    isLoading,
  } = useMembersContext()
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const members = contextMembers || []

  useEffect(() => {
    setFilteredMembers(members)
  }, [members])

  useEffect(() => {
    let filtered = [...members]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((member) => {
        const name = member.name?.toLowerCase() || ""
        const email = member.email?.toLowerCase() || ""
        const phone = member.phone_number?.toLowerCase() || ""
        const nin = member.nin?.toLowerCase() || ""
        return (
          name.includes(query) ||
          email.includes(query) ||
          phone.includes(query) ||
          nin.includes(query)
        )
      })
    }

    if (genderFilter !== "all") {
      filtered = filtered.filter(
        (member) => member.gender?.toLowerCase() === genderFilter.toLowerCase()
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (member) => member.user_category === categoryFilter
      )
    }

    setFilteredMembers(filtered)
  }, [searchQuery, genderFilter, categoryFilter, members])

  const handleManualRefresh = async () => {
    try {
      setIsRefreshing(true)
      await refreshMemberCounts()
      toast.success("Members refreshed")
    } catch (error) {
      toast.error("Failed to refresh members")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleDeleteMember = (member: Member) => {
    setMemberToDelete(member)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!memberToDelete) return

    try {
      await deleteMember(memberToDelete.id)
      await refreshMemberCounts()
      toast.success("Member deleted successfully")
      setIsDeleteDialogOpen(false)
      setMemberToDelete(null)
    } catch (error) {
      console.error("Failed to delete member:", error)
      toast.error("Failed to delete member")
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "N/A"
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Gender",
      "DOB",
      "State",
      "LGA",
      "City",
      "Education",
      "Category",
      "Registered Date",
    ]

    const csvData = filteredMembers.map((member) => [
      member.name,
      member.email || "",
      member.phone_number,
      member.gender,
      formatDate(member.dob),
      member.state_of_residence,
      member.lga,
      member.city_of_residence,
      member.highest_level_of_education,
      member.user_category || "",
      formatDate(member.createdAt || ""),
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `members_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Members exported to CSV")
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Members Directory</h2>
          <p className="text-slate-600 mt-1">Manage and view all church members</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleManualRefresh}
            variant="outline"
            className="border-slate-300"
            disabled={isRefreshing}
          >
            <Filter className="w-4 h-4 mr-2" />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="border-slate-300"
            disabled={filteredMembers.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => router.push("/dashboard/register")}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{members.length}</div>
            <p className="text-sm text-slate-600">Total Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {members.filter((m) => m.gender?.toLowerCase() === "male").length}
            </div>
            <p className="text-sm text-slate-600">Male</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-pink-600">
              {members.filter((m) => m.gender?.toLowerCase() === "female").length}
            </div>
            <p className="text-sm text-slate-600">Female</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {
                members.filter((m) => {
                  const createdDate = new Date(m.createdAt || "")
                  const thirtyDaysAgo = new Date()
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                  return createdDate >= thirtyDaysAgo
                }).length
              }
            </div>
            <p className="text-sm text-slate-600">New (30 days)</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, email, phone, or NIN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Just men">Just Men</SelectItem>
                <SelectItem value="Polished Pillars">Polished Pillars</SelectItem>
                <SelectItem value="Visionary Kids">Visionary Kids</SelectItem>
                <SelectItem value="Married/Engaged">Married/Engaged</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(searchQuery || genderFilter !== "all" || categoryFilter !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing {filteredMembers.length} of {members.length} members
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setGenderFilter("all")
                  setCategoryFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <UserPlus className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No members found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Gender</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Education</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Registered</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{member.name}</p>
                          <p className="text-sm text-slate-500">{member.email || "No email"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-slate-900">{member.phone_number}</p>
                          {member.g_phone_number && (
                            <p className="text-slate-500">G: {member.g_phone_number}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            member.gender?.toLowerCase() === "male"
                              ? "border-blue-300 text-blue-700 bg-blue-50"
                              : "border-pink-300 text-pink-700 bg-pink-50"
                          }
                        >
                          {member.gender}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-slate-900">{member.city_of_residence}</p>
                          <p className="text-slate-500">{member.state_of_residence}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-700">
                          {member.highest_level_of_education}
                        </span>
                      </TableCell>
                      <TableCell>
                        {member.user_category ? (
                          <Badge variant="secondary" className="text-xs">
                            {member.user_category}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {formatDate(member.createdAt || "")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Member
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteMember(member)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{memberToDelete?.name}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

