"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentTime, getCurrentDay, formatDate } from "@/utils/time-utils"
import MostUsedCard from "@/components/most-used-card"
import { trackSectionUsage } from "@/utils/usage-tracker"
import ThemeToggle from "@/components/theme-toggle"
import PageTransition from "@/components/page-transition"
import SettingsMenu from "@/components/settings-menu"
import { useTimetable } from "@/contexts/timetable-context"
import BellCountdown from "@/components/bell-countdown"
import { useAuth } from "@/lib/api/hooks"
import { ExternalLink, Wifi, User, Clock } from "lucide-react"
import Link from "next/link"
import WelcomePopup from "@/components/welcome-popup"

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [mounted, setMounted] = useState(false)
  const { nextPeriodInfo } = useTimetable()
  const { isAuthenticated } = useAuth()

  // Mock student data - only used when authenticated
  const studentName = "John"

  // Get current day
  const currentDay = getCurrentDay()

  useEffect(() => {
    setMounted(true)

    // Track home page usage
    trackSectionUsage("home")

    // Update time every minute
    const updateTime = () => {
      setCurrentTime(getCurrentTime())
    }

    updateTime() // Initial call

    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Avoid hydration mismatch
  if (!mounted) return null

  return (
    <PageTransition>
      {/* Welcome Popup for new users */}
      <WelcomePopup isAuthenticated={isAuthenticated} />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
        {/* Header Section - Full Width */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-6">
          <div className="flex justify-between items-center mb-4 fade-in">
            <div>
              <h1 className="text-2xl font-bold">Schedul</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Built For Sydney Boys High School</p>
            </div>
            <div className="flex gap-2">
              <SettingsMenu />
              <ThemeToggle />
            </div>
          </div>

          {/* Personal Greeting - Different based on auth status */}
          <div className="slide-up">
            {isAuthenticated ? (
              <>
                <h2 className="text-3xl font-bold theme-gradient">Hi, {studentName}!</h2>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate()} • {currentDay}
                  </p>
                  <div className="flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    <Wifi className="h-3 w-3" />
                    <span>Connected to SBHS Portal</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold theme-gradient">Welcome!</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Explore your school schedule</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatDate()} • {currentDay}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Main Content - Landscape Layout with Bigger Cards */}
        <div className="p-6 space-y-6">
          {/* Top Row - Sign In Benefits (if not authenticated) */}
          {!isAuthenticated && (
            <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 hover-scale backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="rounded-full p-3 bg-theme-secondary text-theme-primary">
                        <User className="h-8 w-8" />
                      </div>
                      <h3 className="font-semibold text-2xl">Personalize Your Experience</h3>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-3 h-3 rounded-full bg-theme-primary mt-2 flex-shrink-0"></div>
                        <p className="text-base text-gray-600 dark:text-gray-300">
                          <strong>Your Real Timetable:</strong> See your actual classes, teachers, and rooms
                        </p>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-3 h-3 rounded-full bg-theme-primary mt-2 flex-shrink-0"></div>
                        <p className="text-base text-gray-600 dark:text-gray-300">
                          <strong>Personal Notices:</strong> Get notices relevant to your year group
                        </p>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-3 h-3 rounded-full bg-theme-primary mt-2 flex-shrink-0"></div>
                        <p className="text-base text-gray-600 dark:text-gray-300">
                          <strong>Award Points:</strong> Track your actual recognition points and nominations
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-theme-secondary rounded-xl p-6">
                      <p className="text-base text-gray-600 dark:text-gray-300 text-center">
                        Currently viewing demo data. Sign in to see your personal information.
                      </p>
                    </div>

                    <Link href="/auth">
                      <Button className="w-full rounded-xl bg-theme-primary hover:opacity-90 h-14 text-lg">
                        <ExternalLink className="h-6 w-6 mr-3" />
                        Connect SBHS Portal
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Middle Row - Bell Countdown and At a Glance */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Bell Countdown */}
            <div className="slide-up">
              <BellCountdown />
            </div>

            {/* At a Glance Card */}
            <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 hover-scale backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-3 bg-theme-secondary text-theme-primary">
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-xl">At a Glance</h3>
                  </div>
                  <div className="text-base font-medium bg-theme-secondary text-theme-primary px-4 py-2 rounded-full">
                    {currentTime}
                  </div>
                </div>

                <div className="mb-6">
                  {/* Always show timetable info - either real or demo */}
                  {nextPeriodInfo.isCurrentlyInClass && nextPeriodInfo.currentPeriod ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                      <p className="text-base text-gray-500 dark:text-gray-400 mb-3">Currently in:</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-2xl">{nextPeriodInfo.currentPeriod.subject}</p>
                          <p className="text-base text-gray-500 dark:text-gray-400">
                            {nextPeriodInfo.currentPeriod.period} • {nextPeriodInfo.currentPeriod.room}
                            {!isAuthenticated && <span className="ml-2 text-blue-500">(Demo)</span>}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 pulse-subtle">
                            {nextPeriodInfo.timeUntil}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">until end</div>
                        </div>
                      </div>
                    </div>
                  ) : nextPeriodInfo.nextPeriod ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                      <p className="text-base text-gray-500 dark:text-gray-400 mb-3">Next up:</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-2xl">{nextPeriodInfo.nextPeriod.subject}</p>
                          <p className="text-base text-gray-500 dark:text-gray-400">
                            {nextPeriodInfo.nextPeriod.period} • {nextPeriodInfo.nextPeriod.room}
                            {!isAuthenticated && <span className="ml-2 text-blue-500">(Demo)</span>}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-theme-primary pulse-subtle">
                            {nextPeriodInfo.timeUntil}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">until start</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400 text-xl">
                        No more classes today
                        {!isAuthenticated && <span className="ml-2 text-blue-500">(Demo)</span>}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row - Most Used and Quick Stats */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Most Used Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4 px-2">
                <h3 className="text-xl font-bold">Most Used</h3>
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
              </div>
              <MostUsedCard />
            </div>

            {/* Quick Overview */}
            <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 hover-scale backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-6">Quick Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-theme-secondary rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-theme-primary mb-2">8</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Nominations</div>
                    {!isAuthenticated && <div className="text-xs text-blue-500 mt-1">(Demo)</div>}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2">5</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Classes Today</div>
                    {!isAuthenticated && <div className="text-xs text-blue-500 mt-1">(Demo)</div>}
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">3</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">New Notices</div>
                    {!isAuthenticated && <div className="text-xs text-blue-500 mt-1">(Demo)</div>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </PageTransition>
  )
}
