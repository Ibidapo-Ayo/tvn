"use client"

import { 
  Calendar, 
  Home, 
  Users, 
  UserCheck, 
  MessageSquare, 
  Settings, 
  LogOut, 
  UserPlus,
  Sparkles,
  TrendingUp
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { useEventsContext } from "@/contexts/events-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"

export function AppSidebar() {
  const { logout } = useAuth()
  const { upcomingEventsCount, totalEventsCount } = useEventsContext()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Navigation items for the main application features
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      badge: null,
    },
    {
      title: "Member Registration",
      url: "/dashboard/register",
      icon: UserPlus,
      badge: null,
    },
    {
      title: "Members",
      url: "/dashboard/users",
      icon: Users,
      badge: null,
    },
    {
      title: "Events",
      url: "/dashboard/events",
      icon: Calendar,
      badge: upcomingEventsCount.toString(),
    },
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: UserCheck,
      badge: null,
    },
    {
      title: "Birthdays",
      url: "/dashboard/messages",
      icon: MessageSquare,
      badge: null, // TODO: Connect to Firebase for birthday counts
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      badge: null,
    },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200">
      {/* Beautiful Header */}
      <SidebarHeader className="border-b border-slate-200/60 bg-linear-gradient(to bottom, #ffffff, #f0f0f0) p-4">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <Image
              src="/tha_logo.png"
              alt="TVN Logo"
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-slate-900 truncate">The Visionary Nation</p>
            <p className="text-xs text-slate-600 truncate flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-500" />
              {user?.name || "Administrator"}
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation Menu */}
      <SidebarContent className="bg-white px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive} 
                      tooltip={item.title}
                      className={`
                        rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40' 
                          : 'hover:bg-slate-50 text-slate-700 hover:text-orange-600'
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5">
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                        <span className="font-medium text-sm flex-1 text-left">{item.title}</span>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className={`
                              text-xs px-2 py-0.5 font-semibold
                              ${isActive 
                                ? 'bg-white/20 text-white border-white/30' 
                                : 'bg-orange-100 text-orange-700 border-orange-200'
                              }
                            `}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4 bg-slate-200" />

        {/* Quick Stats Card */}
        <div className="mx-3 p-4 rounded-xl bg-linear-to-br from-orange-50 via-white to-purple-50 border border-orange-100/50 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">This Week</p>
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">New Members</span>
              <span className="text-sm font-bold text-orange-600">+12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Events Held</span>
              <span className="text-sm font-bold text-purple-600">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Attendance</span>
              <span className="text-sm font-bold text-green-600">92%</span>
            </div>
          </div>
        </div>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-200/60 bg-slate-50/50 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button 
              variant="ghost" 
              className="w-full justify-start hover:bg-red-50 hover:text-red-600 transition-all duration-200 group rounded-xl" 
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Sign Out</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
