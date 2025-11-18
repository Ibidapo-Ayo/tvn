"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Gift, Plus, Send, Calendar, Edit, Trash2, Mail, Sparkles, Cake, Heart, CheckCircle2 } from "lucide-react"
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

interface MessageTemplate {
  id: string
  subject: string
  template: string
  isActive: boolean
}

interface UpcomingBirthday {
  id: string
  name: string
  email: string
  birthday: string
  daysUntil: number
  messageScheduled: boolean
}

export function BirthdayMessages() {
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false)
  const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<MessageTemplate | null>(null)

  const [newTemplate, setNewTemplate] = useState({
    subject: "",
    template: "",
    isActive: false,
  })

  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([
    {
      id: "1",
      subject: "Happy Birthday! 🎉",
      template: "Dear {name},\n\nWishing you a blessed birthday filled with joy and love!",
      isActive: true,
    },
    {
      id: "2",
      subject: "Birthday Blessings",
      template: "Happy Birthday {name}! May God bless you abundantly in the year ahead.",
      isActive: false,
    },
  ])

  const [upcomingBirthdays, setUpcomingBirthdays] = useState<UpcomingBirthday[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      birthday: "1990-01-15",
      daysUntil: 2,
      messageScheduled: true,
    },
    {
      id: "2",
      name: "Mary Johnson",
      email: "mary.johnson@example.com",
      birthday: "1985-01-16",
      daysUntil: 3,
      messageScheduled: true,
    },
    {
      id: "3",
      name: "David Wilson",
      email: "david.wilson@example.com",
      birthday: "1978-01-18",
      daysUntil: 5,
      messageScheduled: false,
    },
  ])

  const handleCreateTemplate = () => {
    if (!newTemplate.subject || !newTemplate.template) {
      toast.error("Please fill in all required fields")
      return
    }

    const templateData: MessageTemplate = {
      id: Date.now().toString(),
      subject: newTemplate.subject,
      template: newTemplate.template,
      isActive: newTemplate.isActive,
    }

    setMessageTemplates((prev) => [...prev, templateData])
    toast.success("Template created successfully!")

    setNewTemplate({ subject: "", template: "", isActive: false })
    setIsCreateTemplateOpen(false)
  }

  const handleEditTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template)
    setIsEditTemplateOpen(true)
  }

  const handleUpdateTemplate = () => {
    if (selectedTemplate) {
      setMessageTemplates((prev) =>
        prev.map((t) => (t.id === selectedTemplate.id ? selectedTemplate : t))
      )
      toast.success("Template updated successfully!")
      setIsEditTemplateOpen(false)
      setSelectedTemplate(null)
    }
  }

  const handleDeleteTemplate = (template: MessageTemplate) => {
    setTemplateToDelete(template)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteTemplate = () => {
    if (templateToDelete) {
      setMessageTemplates((prev) => prev.filter((t) => t.id !== templateToDelete.id))
      toast.success("Template deleted")
      setIsDeleteDialogOpen(false)
      setTemplateToDelete(null)
    }
  }

  const handleToggleTemplate = (templateId: string, isActive: boolean) => {
    setMessageTemplates((prev) =>
      prev.map((t) => (t.id === templateId ? { ...t, isActive } : t))
    )
    toast.success(`Template ${isActive ? "activated" : "deactivated"}`)
  }

  const handleSendMessage = (person: UpcomingBirthday) => {
    setUpcomingBirthdays((prev) =>
      prev.map((p) => (p.id === person.id ? { ...p, messageScheduled: true } : p))
    )
    toast.success(`Birthday message sent to ${person.name}!`)
  }

  const formatBirthdayDate = (birthday: string) => {
    return new Date(birthday).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getDaysText = (days: number) => {
    if (days === 0) return "Today 🎉"
    if (days === 1) return "Tomorrow"
    return `In ${days} days`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <div></div>
        <Button
          onClick={() => setIsCreateTemplateOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl h-12 px-6 rounded-xl font-semibold"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-pink-500 to-pink-600"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Upcoming Birthdays</p>
                <p className="text-3xl font-bold text-slate-900">{upcomingBirthdays.length}</p>
                <p className="text-xs text-slate-500 mt-1">Next 7 days</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Cake className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Active Templates</p>
                <p className="text-3xl font-bold text-slate-900">
                  {messageTemplates.filter((t) => t.isActive).length}
                </p>
                <p className="text-xs text-slate-500 mt-1">Ready to send</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Mail className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Messages Sent</p>
                <p className="text-3xl font-bold text-slate-900">127</p>
                <p className="text-xs text-slate-500 mt-1">This month</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Send className="h-7 w-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Birthdays */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-pink-600" />
            <h3 className="font-bold text-xl text-slate-900">Upcoming Birthdays</h3>
          </div>

          {upcomingBirthdays.length > 0 ? (
            <div className="space-y-4">
              {upcomingBirthdays.map((person) => (
                <Card
                  key={person.id}
                  className="group relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-pink-400 rounded-2xl bg-white"
                >
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-100/50 to-purple-100/30 rounded-full blur-xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>

                  <CardContent className="relative p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-sm">
                            <Cake className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg text-slate-900 truncate">{person.name}</h4>
                            <p className="text-sm text-slate-600">{formatBirthdayDate(person.birthday)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <Badge
                            className={`${
                              person.daysUntil === 0
                                ? "bg-pink-100 text-pink-700 border-pink-200"
                                : "bg-purple-100 text-purple-700 border-purple-200"
                            }`}
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            {getDaysText(person.daysUntil)}
                          </Badge>

                          {person.messageScheduled && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Scheduled
                            </Badge>
                          )}
                        </div>
                      </div>

                      {!person.messageScheduled && (
                        <Button
                          onClick={() => handleSendMessage(person)}
                          size="sm"
                          className="shrink-0 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-md rounded-lg h-9 px-4"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-lg border-slate-200 rounded-2xl">
              <CardContent className="p-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8 text-pink-600" />
                  </div>
                  <p className="text-slate-600">No upcoming birthdays in the next 7 days</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Message Templates */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-orange-600" />
            <h3 className="font-bold text-xl text-slate-900">Message Templates</h3>
          </div>

          {messageTemplates.length > 0 ? (
            <div className="space-y-4">
              {messageTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="group relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-orange-400 rounded-2xl bg-white"
                >
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100/50 to-purple-100/30 rounded-full blur-xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>

                  <CardContent className="relative p-5">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-lg text-slate-900 mb-1">{template.subject}</h4>
                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {template.template}
                          </p>
                        </div>
                        <Switch
                          checked={template.isActive}
                          onCheckedChange={(checked) => handleToggleTemplate(template.id, checked)}
                        />
                      </div>

                      {/* Status and Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <Badge
                          className={
                            template.isActive
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }
                        >
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditTemplate(template)}
                            variant="ghost"
                            size="sm"
                            className="h-9 px-3 hover:bg-orange-50 hover:text-orange-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteTemplate(template)}
                            variant="ghost"
                            size="sm"
                            className="h-9 px-3 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-lg border-slate-200 rounded-2xl">
              <CardContent className="p-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-slate-600 mb-4">No message templates yet</p>
                    <Button
                      onClick={() => setIsCreateTemplateOpen(true)}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg h-10 px-5 rounded-xl"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Template Dialog */}
      <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create Message Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Happy Birthday! 🎉"
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate((prev) => ({ ...prev, subject: e.target.value }))}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Message Template *</Label>
              <Textarea
                id="template"
                placeholder="Use {name} for personalization..."
                value={newTemplate.template}
                onChange={(e) => setNewTemplate((prev) => ({ ...prev, template: e.target.value }))}
                rows={5}
              />
              <p className="text-xs text-slate-500">
                Available variables: <code className="bg-slate-100 px-1 rounded">{"{name}"}</code>
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200">
              <Switch
                id="active"
                checked={newTemplate.isActive}
                onCheckedChange={(checked) => setNewTemplate((prev) => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="active" className="text-sm font-medium text-slate-700 cursor-pointer">
                Set as active template
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateTemplateOpen(false)} className="h-11">
              Cancel
            </Button>
            <Button
              onClick={handleCreateTemplate}
              className="h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditTemplateOpen} onOpenChange={setIsEditTemplateOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Message Template</DialogTitle>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-subject">Email Subject</Label>
                <Input
                  id="edit-subject"
                  value={selectedTemplate.subject}
                  onChange={(e) =>
                    setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-template">Message Template</Label>
                <Textarea
                  id="edit-template"
                  value={selectedTemplate.template}
                  onChange={(e) =>
                    setSelectedTemplate({ ...selectedTemplate, template: e.target.value })
                  }
                  rows={5}
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200">
                <Switch
                  checked={selectedTemplate.isActive}
                  onCheckedChange={(checked) =>
                    setSelectedTemplate({ ...selectedTemplate, isActive: checked })
                  }
                />
                <Label className="text-sm font-medium text-slate-700 cursor-pointer">
                  Set as active template
                </Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTemplateOpen(false)} className="h-11">
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTemplate}
              className="h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Update Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{templateToDelete?.subject}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTemplate} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
