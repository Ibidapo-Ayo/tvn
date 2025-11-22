"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Calendar,
  UserCheck,
  Gift,
  TrendingUp,
  Clock,
  Cake,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Event, Member } from "@/types/types";
import { useRouter } from "next/navigation";
import { useAll } from "@/hooks/use-all";
import { useMembersContext } from "@/contexts/members-context";
import { useEventsContext } from "@/contexts/events-context";
import {
  formatDate,
  getNextMemberBirthday,
  upcomingBirthdaysMembers,
} from "@/lib/utils";

export function DashboardOverview() {
  const router = useRouter();
  const { getRecentEvents } = useAll();
  const {
    totalMembersCount,
    members: allMembers,
    isLoading: isMembersLoading,
    upcomingBirthdaysMembersList,
  } = useMembersContext();
  const { upcomingEventsCount, isLoading: isEventsLoading } =
    useEventsContext();
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [newMembersThisMonth, setNewMembersThisMonth] = useState(0);
  const [membersUpcomingBirthdays, setMembersUpcomingBirthdays] = useState<
    Member[]
  >([]);
  const [nextMemberBirthday, setNextMemberBirthday] = useState<{
    nextMemberBirthday: Member[];
    nextBirthdayText: string;
  }>({ nextMemberBirthday: [], nextBirthdayText: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recent] = await Promise.all([getRecentEvents(3)]);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newMembersCount = allMembers?.filter((member: Member) => {
          if (!member.createdAt) return false;
          const memberDate = new Date(member.createdAt);
          return memberDate >= startOfMonth;
        }).length;

        setNewMembersThisMonth(newMembersCount);
        setRecentEvents(recent);
      } catch (error) {
        console.error("❌ Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setMembersUpcomingBirthdays(upcomingBirthdaysMembersList);
  }, [upcomingBirthdaysMembersList]);

  useEffect(() => {
    const { nextMemberBirthday, nextBirthdayText } = getNextMemberBirthday(
      membersUpcomingBirthdays || []
    );
    setNextMemberBirthday({ nextMemberBirthday, nextBirthdayText });
  }, [membersUpcomingBirthdays]);
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500 via-blue-600 to-blue-700"></div>
          <CardHeader className="relative pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/90">
                Total Members
              </CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-white mb-1">
              {totalMembersCount}
            </div>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>+{newMembersThisMonth} this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500 via-purple-600 to-purple-700"></div>
          <CardHeader className="relative pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/90">
                Upcoming Events
              </CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-white mb-1">
              {upcomingEventsCount}
            </div>
            <p className="text-white/80 text-sm">This month</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-br from-green-500 via-green-600 to-green-700"></div>
          <CardHeader className="relative pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/90">
                Today's Attendance
              </CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-white mb-1">{0}</div>
            <p className="text-white/80 text-sm">Members present</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-linear-to-br from-pink-500 via-pink-600 to-rose-600"></div>
          <CardHeader className="relative pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/90">
                Upcoming Birthdays
              </CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Gift className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-white mb-1">
              {nextMemberBirthday.nextMemberBirthday?.length || 0}
            </div>
            <p className="text-white/80 text-sm">
              {nextMemberBirthday.nextBirthdayText}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events and Birthdays */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Events Card */}
        <Card className="shadow-lg border-slate-200 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900">
                {recentEvents.length > 0 &&
                recentEvents[0].date < new Date().toISOString().split("T")[0]
                  ? "Recent Events"
                  : "Latest Events"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={() => router.push("/dashboard/events")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEventsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
            ) : recentEvents.length > 0 ? (
              <div className="space-y-4">
                {recentEvents.map((event) => {
                  const getEventTypeColor = (type: string) => {
                    const colors: Record<string, string> = {
                      sunday_service:
                        "bg-blue-100 text-blue-700 border-blue-200",
                      sod: "bg-purple-100 text-purple-700 border-purple-200",
                      sop: "bg-orange-100 text-orange-700 border-orange-200",
                    };
                    return (
                      colors[type] ||
                      "bg-slate-100 text-slate-700 border-slate-200"
                    );
                  };

                  const getEventTypeName = (type: string) => {
                    const names: Record<string, string> = {
                      sunday_service: "Sunday Service",
                      sod: "SOD",
                      sop: "SOP",
                    };
                    return names[type] || "Event";
                  };

                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-4 rounded-xl bg-linear-to-r from-slate-50 to-white border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all duration-200 group cursor-pointer"
                      onClick={() => router.push("/dashboard/events")}
                    >
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">
                            {event.title}
                          </h4>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getEventTypeColor(
                              event.type
                            )}`}
                          >
                            {getEventTypeName(event.type)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {formatDate(event.date)} • {event.time || "N/A"}
                            </span>
                          </div>
                        </div>
                        {event.description && (
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">
                          {event.attendees?.length || 0}
                        </div>
                        <div className="text-xs text-slate-500">attendees</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-linear-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No Recent Events
                </h3>
                <p className="text-slate-500 mb-4">
                  You haven't created any events yet.
                </p>
                <Button
                  size="sm"
                  className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  onClick={() => router.push("/dashboard/events")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Your First Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Birthdays Card */}
        <Card className="shadow-lg border-slate-200 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900">
                Upcoming Birthdays
              </CardTitle>
              <Link href="/dashboard/birthdays">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                >
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isMembersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
            ) : membersUpcomingBirthdays.length > 0 ? (
              <div className="space-y-4">
                {membersUpcomingBirthdays.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-linear-to-r from-slate-50 to-white border border-slate-100 hover:border-pink-200 hover:shadow-md transition-all duration-200 group"
                  >
                    <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                      <AvatarFallback
                        className={`bg-linear-to-br from-pink-500 to-rose-600 text-white font-semibold`}
                      >
                        {person.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">
                        {person.name}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Cake className="h-3.5 w-3.5" />
                        <span>{formatDate(person.dob as string)}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-sm"
                    >
                      Send Wish
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-linear-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No Upcoming Birthdays
                </h3>
                <p className="text-slate-500 mb-4">
                  No upcoming birthdays found.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
