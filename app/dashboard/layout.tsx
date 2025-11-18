"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, Search, User, Sun } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { EventsProvider } from "@/contexts/events-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const getPageInfo = () => {
    const routes = {
      '/dashboard': {
        title: 'Dashboard Overview',
        subtitle: 'Monitor your church activities and metrics at a glance'
      },
      '/dashboard/users': {
        title: 'Member Management',
        subtitle: 'Manage and organize your church members'
      },
      '/dashboard/register': {
        title: 'Member Registration',
        subtitle: 'Add new members to your congregation'
      },
      '/dashboard/programs': {
        title: 'Program Registration',
        subtitle: 'Register and manage church programs'
      },
      '/dashboard/events': {
        title: 'Event Management',
        subtitle: 'Plan and schedule church events'
      },
      '/dashboard/attendance': {
        title: 'Attendance Tracking',
        subtitle: 'Track member attendance and participation'
      },
      '/dashboard/messages': {
        title: 'Birthday Celebrations',
        subtitle: 'Send birthday wishes to your members'
      },
      '/dashboard/settings': {
        title: 'System Settings',
        subtitle: 'Configure your system preferences'
      }
    }
    
    return routes[pathname as keyof typeof routes] || routes['/dashboard']
  }

  const pageInfo = getPageInfo()

  return (
    <EventsProvider>
      <SidebarProvider>
        <AppSidebar />
      <SidebarInset className="bg-gradient-to-br from-slate-50 via-white to-orange-50/20">
        {/* Beautiful Modern Header */}
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
          <div className="flex h-20 items-center gap-6 px-8">
            <SidebarTrigger className="hover:bg-orange-50 rounded-lg transition-colors" />
            
            <div className="flex items-center gap-4 flex-1">
              {/* Church Logo and Branding */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <Image
                    src="/tha_logo.png"
                    alt="TVN Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                    The Visionary Nation
                  </h1>
                  <p className="text-sm text-slate-600">Church Management System</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-md ml-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Search members, events..."
                    className="w-full pl-10 pr-4 h-11 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Time Display */}
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                <Sun className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-slate-700">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric'
                  })}
                </span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-slate-100">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </Button>

              {/* User Avatar */}
              <div className="flex items-center gap-3 pl-3 pr-4 py-2 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-sm">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-700 hidden md:block">
                  {user?.name || "Administrator"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Title Section with Beautiful Gradient */}
        <div className="relative px-8 pt-8 pb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-purple-500/5 to-blue-500/5"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{pageInfo.title}</h2>
            <p className="text-slate-600">{pageInfo.subtitle}</p>
          </div>
        </div>

        {/* Main Content Area with Animation */}
        <main className="flex-1 overflow-auto px-8 pb-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
    </EventsProvider>
  )
}

