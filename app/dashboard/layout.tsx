"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { User, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { EventsProvider } from "@/contexts/events-context";
import { MembersProvider } from "@/contexts/members-context";
import { useAuth } from "@/components/auth-provider";
import { AuthLabels } from "@/lib/utils";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-600">
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  const getPageInfo = () => {
    const routes = {
      "/dashboard": {
        title: "Dashboard Overview",
        subtitle: "Monitor your church activities and metrics at a glance",
      },
      "/dashboard/users": {
        title: "Member Management",
        subtitle: "Manage and organize your church members",
      },
      "/dashboard/register": {
        title: "Member Registration",
        subtitle: "Add new members to your congregation",
      },
      "/dashboard/programs": {
        title: "Program Registration",
        subtitle: "Register and manage church programs",
      },
      "/dashboard/events": {
        title: "Event Management",
        subtitle: "Plan and schedule church events",
      },
      "/dashboard/attendance": {
        title: "Attendance Tracking",
        subtitle: "Track member attendance and participation",
      },
      "/dashboard/messages": {
        title: "Birthday Celebrations",
        subtitle: "Send birthday wishes to your members",
      },
      "/dashboard/settings": {
        title: "System Settings",
        subtitle: "Configure your system preferences",
      },
    };

    return routes[pathname as keyof typeof routes] || routes["/dashboard"];
  };

  const pageInfo = getPageInfo();

  return (
    <EventsProvider>
      <MembersProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="bg-linear-to-br from-slate-50 via-white to-orange-50/20">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl supports-backdrop-filter:bg-white/60">
              <div className="flex h-20 items-center gap-6 px-8">
                <SidebarTrigger className="hover:bg-orange-50 rounded-lg transition-colors" />

                <div className="flex items-center gap-4 flex-1">
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
                      <h1 className="text-xl font-bold bg-linear-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                        The Visionary Nation
                      </h1>
                      <p className="text-sm text-slate-600">
                        Church Management System
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                    <Sun className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-slate-700">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex flex-col items-center pl-3 pr-4 py-2 bg-linear-to-r from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-sm">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {user?.name || "Administrator"}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-700 text-center">
                      {AuthLabels[user?.labels[0] as keyof typeof AuthLabels]}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            <div className="relative px-8 pt-8 pb-6 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-orange-500/5 via-purple-500/5 to-blue-500/5"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {pageInfo.title}
                </h2>
                <p className="text-slate-600">{pageInfo.subtitle}</p>
              </div>
            </div>

            <main className="flex-1 overflow-auto px-8 pb-8">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {children}
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </MembersProvider>
    </EventsProvider>
  );
}
