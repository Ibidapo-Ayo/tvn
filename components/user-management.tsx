"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Plus, Mail, Phone, Calendar, Edit, Trash2, Users, Sparkles } from "lucide-react"
import { toast } from "sonner"
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

interface UserData {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  createdAt: string
  role: "user" | "admin"
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null)

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
  })

  const [users, setUsers] = useState<UserData[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1990-05-15",
      address: "123 Main St, City, State",
      createdAt: "2024-01-01",
      role: "user",
    },
    {
      id: "2",
      name: "Mary Johnson",
      email: "mary.johnson@example.com",
      phone: "+1 (555) 234-5678",
      dateOfBirth: "1985-08-22",
      address: "456 Oak Ave, City, State",
      createdAt: "2024-01-02",
      role: "user",
    },
    {
      id: "3",
      name: "David Wilson",
      email: "david.wilson@example.com",
      phone: "+1 (555) 345-6789",
      dateOfBirth: "1978-12-03",
      address: "789 Pine Rd, City, State",
      createdAt: "2024-01-03",
      role: "user",
    },
  ])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  )

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone) {
      toast.error("Please fill in all required fields")
      return
    }

    const userData: UserData = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      dateOfBirth: newUser.dateOfBirth,
      address: newUser.address,
      createdAt: new Date().toISOString().split("T")[0],
      role: "user",
    }

    setUsers((prev) => [...prev, userData])
    toast.success("Member added successfully!")

    setNewUser({ name: "", email: "", phone: "", dateOfBirth: "", address: "" })
    setIsAddUserOpen(false)
  }

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user)
    setIsEditUserOpen(true)
  }

  const handleUpdateUser = () => {
    if (selectedUser) {
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? selectedUser : u)))
      toast.success("Member updated successfully!")
      setIsEditUserOpen(false)
      setSelectedUser(null)
    }
  }

  const handleDeleteUser = (user: UserData) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id))
      toast.success("Member deleted")
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-6 pt-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search members by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-base border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm"
          />
        </div>
        <Button
          onClick={() => setIsAddUserOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl h-12 px-6 rounded-xl font-semibold"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Members Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-orange-400 rounded-2xl bg-white"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/50 to-purple-100/30 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

              <CardContent className="relative p-6">
                <div className="space-y-5">
                  {/* Avatar and Name */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-lg font-bold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                        {user.name}
                      </h3>
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        Member
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/50">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm shrink-0">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Email</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-50/50">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm shrink-0">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Phone</p>
                        <p className="text-sm font-semibold text-slate-900">{user.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-purple-50/50">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm shrink-0">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Birth Date</p>
                        <p className="text-sm font-semibold text-slate-900">{formatDate(user.dateOfBirth)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleEditUser(user)}
                      variant="outline"
                      className="flex-1 h-10 rounded-xl border-slate-300 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteUser(user)}
                      variant="outline"
                      className="flex-1 h-10 rounded-xl border-slate-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="shadow-lg border-slate-200 rounded-2xl">
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-10 w-10 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Members Found</h3>
                <p className="text-slate-600 mb-6">
                  {searchTerm
                    ? "No members match your search. Try different keywords."
                    : "Get started by adding your first member!"}
                </p>
              </div>
              <Button
                onClick={() => setIsAddUserOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg h-11 px-6 rounded-xl font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Member
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Member Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Member</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={newUser.phone}
                onChange={(e) => setNewUser((prev) => ({ ...prev, phone: e.target.value }))}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={newUser.dateOfBirth}
                onChange={(e) => setNewUser((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Full address"
                value={newUser.address}
                onChange={(e) => setNewUser((prev) => ({ ...prev, address: e.target.value }))}
                className="h-11"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)} className="h-11">
              Cancel
            </Button>
            <Button onClick={handleAddUser} className="h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Member</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={selectedUser.phone}
                  onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dob">Date of Birth</Label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={selectedUser.dateOfBirth}
                  onChange={(e) => setSelectedUser({ ...selectedUser, dateOfBirth: e.target.value })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={selectedUser.address}
                  onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)} className="h-11">
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} className="h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
