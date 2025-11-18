"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Settings as SettingsIcon, Mail, Database, CheckCircle2, HardDrive, Eye, EyeOff, Building2, Bell } from "lucide-react"
import { toast } from "sonner"

export function Settings() {
  const [showPassword, setShowPassword] = useState(false)

  const [settings, setSettings] = useState({
    organizationName: "The Visionary Nation",
    timezone: "america/new_york",
    adminEmail: "admin@tvn.church",
    smtpServer: "smtp.gmail.com",
    smtpPort: "587",
    emailUsername: "noreply@tvn.church",
    emailPassword: "••••••••",
    emailNotifications: true,
    autoBackup: true,
    backupFrequency: "daily",
  })

  const handleSaveSettings = () => {
    if (!settings.organizationName || !settings.adminEmail) {
      toast.error("Please fill in all required fields")
      return
    }

    toast.success("Settings saved successfully!")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-4"></div>

      {/* Settings Sections */}
      <div className="grid gap-6 max-w-5xl">
        {/* Organization Settings */}
        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900">Organization Settings</h3>
                <p className="text-sm text-slate-600">Basic church information and preferences</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="org-name" className="text-slate-700 font-medium">
                    Church Name *
                  </Label>
                  <Input
                    id="org-name"
                    value={settings.organizationName}
                    onChange={(e) => setSettings((prev) => ({ ...prev, organizationName: e.target.value }))}
                    placeholder="Enter church name"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-slate-700 font-medium">
                    Timezone
                  </Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/new_york">Eastern Time (ET)</SelectItem>
                      <SelectItem value="america/chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="america/denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="america/los_angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="europe/london">London (GMT)</SelectItem>
                      <SelectItem value="asia/tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-slate-700 font-medium">
                  Administrator Email *
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings((prev) => ({ ...prev, adminEmail: e.target.value }))}
                  placeholder="admin@example.com"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900">Email Configuration</h3>
                <p className="text-sm text-slate-600">SMTP settings for birthday messages</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="smtp-server" className="text-slate-700 font-medium">
                    SMTP Server
                  </Label>
                  <Input
                    id="smtp-server"
                    value={settings.smtpServer}
                    onChange={(e) => setSettings((prev) => ({ ...prev, smtpServer: e.target.value }))}
                    placeholder="smtp.gmail.com"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtp-port" className="text-slate-700 font-medium">
                    Port
                  </Label>
                  <Input
                    id="smtp-port"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings((prev) => ({ ...prev, smtpPort: e.target.value }))}
                    placeholder="587"
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="email-username" className="text-slate-700 font-medium">
                    Username
                  </Label>
                  <Input
                    id="email-username"
                    value={settings.emailUsername}
                    onChange={(e) => setSettings((prev) => ({ ...prev, emailUsername: e.target.value }))}
                    placeholder="noreply@church.com"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-password" className="text-slate-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="email-password"
                      type={showPassword ? "text" : "password"}
                      value={settings.emailPassword}
                      onChange={(e) => setSettings((prev) => ({ ...prev, emailPassword: e.target.value }))}
                      placeholder="Enter password"
                      className="h-11 rounded-xl pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between p-4 rounded-xl bg-purple-50 border border-purple-200">
                <div>
                  <p className="font-medium text-slate-900">Email Notifications</p>
                  <p className="text-sm text-slate-600">Send system notifications and alerts via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Backup */}
        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900">Data & Backup</h3>
                <p className="text-sm text-slate-600">Configure automatic backups and data retention</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Statistics */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-orange-50/30 border border-slate-200">
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Members</p>
                  <p className="text-2xl font-bold text-slate-900">1,247</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-purple-50/30 border border-slate-200">
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Events</p>
                  <p className="text-2xl font-bold text-slate-900">45</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-green-50/30 border border-slate-200">
                  <p className="text-sm font-medium text-slate-600 mb-1">Attendance Records</p>
                  <p className="text-2xl font-bold text-slate-900">3,892</p>
                </div>
              </div>

              {/* Backup Settings */}
              <div className="space-y-2">
                <Label htmlFor="backup-frequency" className="text-slate-700 font-medium">
                  Backup Frequency
                </Label>
                <Select
                  value={settings.backupFrequency}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, backupFrequency: value }))}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                <div>
                  <p className="font-medium text-slate-900">Automatic Backup</p>
                  <p className="text-sm text-slate-600">Automatically backup data at scheduled intervals</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoBackup: checked }))}
                />
              </div>

              {/* Backup Info */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <HardDrive className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Last Backup</p>
                    <p className="text-sm text-slate-700">January 13, 2024 at 2:00 AM</p>
                    <p className="text-xs text-slate-600 mt-1">Size: 2.4 GB • Status: Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="shadow-lg border-slate-200 rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900">Notification Preferences</h3>
                <p className="text-sm text-slate-600">Manage system notifications and alerts</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-900">Birthday Reminders</p>
                  <p className="text-sm text-slate-600">Get notified about upcoming birthdays</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-900">Event Notifications</p>
                  <p className="text-sm text-slate-600">Receive alerts for upcoming events</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-900">Attendance Alerts</p>
                  <p className="text-sm text-slate-600">Get notified about attendance updates</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl h-12 px-8 rounded-xl font-semibold"
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
