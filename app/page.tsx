"use client"

import { useAuth } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-600">Preparing your workspace…</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-600">Redirecting to the dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-10 lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            Membership Desk
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-400">
              The Visionary Nation • Membership Services
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white lg:text-5xl">
              A calm space to onboard, care for, and guide every member.
            </h1>
            <p className="max-w-2xl text-base text-slate-400">
              Sign in to steward profiles, attendance, pastoral follow-up, and support
              moments that matter. The interface keeps distractions out so care stays
              front and center.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-4xl font-semibold text-white">5,482</p>
              <p className="mt-2 text-sm text-slate-400">Active members</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-4xl font-semibold text-white">362</p>
              <p className="mt-2 text-sm text-slate-400">New sign-ups (30d)</p>
            </div>
          </div>

          <div className="relative mt-6 w-full max-w-xl">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-slate-900 blur-2xl"></div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    Membership ID
                  </p>
                  <p className="text-lg font-semibold text-white">TVN-084210</p>
                </div>
                <Image
                  src="/tha_logo.png"
                  alt="TVN Logo"
                  width={56}
                  height={56}
                  className="rounded-full border border-slate-800 bg-white/90 p-2"
                  priority
                />
              </div>
              <div className="mt-6 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Member
                  </p>
                  <p className="text-base font-medium text-white">
                    Onyeka A., Polished Pillars
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Valid Till
                  </p>
                  <p className="text-base font-medium text-white">
                    December 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <Image
              src="/tha_logo.png"
              alt="TVN Logo"
              width={72}
              height={72}
              className="object-contain"
              priority
            />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Secure Access
              </p>
              <h2 className="text-2xl font-semibold text-white">Sign in to continue</h2>
            </div>
          </div>

          <Card className="border border-slate-200/70 bg-white shadow-xl">
            <CardHeader className="text-left">
              <CardTitle className="text-2xl font-semibold text-slate-900">
                TVN Membership Portal
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Enter your credentials to reach member profiles, events, and service insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} The Visionary Nation • Membership Services
          </p>
        </section>
      </div>
    </div>
  )
}
