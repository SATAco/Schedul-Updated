"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentTime, getCurrentDay, formatDate, isWithinSchoolHours } from "@/utils/time-utils"
import { getNextBell, formatCountdown, formatTimeTo12Hour } from "@/utils/bell-utils"
import MostUsedCard from "@/components/most-used-card"
import { trackSectionUsage } from "@/utils/usage-tracker"
import ThemeToggle from "@/components/theme-toggle"
import PageTransition from "@/components/page-transition"
import SettingsMenu from "@/components/settings-menu"
import { useTimetable } from "@/contexts/timetable-context"
import { useAuth } from "@/lib/api/hooks"
import { ExternalLink, Wifi, User, Clock } from "lucide-react"
import Link from "next/link"
import WelcomePopup from "@/components/welcome-popup"

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [bellCountdown, setBellCountdown] = useState("00:00")
  const [bellInfo, setBellInfo] = useState<{
    nextBell: { period: string; time: string } | null
    isCurrentlyInClass: boolean
    currentPeriod: { period: string; time: string } | null
  }>({
    nextBell: null,
    isCurrentlyInClass: false,
    currentPeriod: null,
  })
  const [mounted, setMounted] = useState(false)
  const { nextPeriodInfo, bellTimes } = useTimetable()
  const { isAuthenticated } = useAuth()

  // Mock student data - only used when authenticated
  const studentName = "John"

  // Get current day
  const currentDay = getCurrentDay()

  // Determine which bell times schedule to use based on the current day
  const getBellTimesSchedule = () => {
    if (currentDay === "Monday" || currentDay === "Tuesday") {
      return "Mon/Tues"
    } else if (currentDay === "Wednesday" || currentDay === "Thursday") {
      return "Wed/Thurs"
    } else if (currentDay === "Friday") {
      return "Fri"
    }
    return "Mon/Tues" // Default
  }

  useEffect(() => {
    setMounted(true)

    // Track home page usage
    trackSectionUsage("home")

    // Update time every minute
    const updateTime = () => {
      setCurrentTime(getCurrentTime())
    }

    // Update bell countdown every second
    const updateBellCountdown = () => {
      const currentSchedule = getBellTimesSchedule()
      const currentBellTimes = bellTimes[currentSchedule]

      if (!currentBellTimes || !isWithinSchoolHours()) {
        setBellCountdown("00:00")
        setBellInfo({
          nextBell: null,
          isCurrentlyInClass: false,
          currentPeriod: null,
        })
        return
      }

      const { nextBell, timeUntil, isCurrentlyInPeriod, currentPeriod } = getNextBell(currentBellTimes)

      setBellInfo({
        nextBell,
        isCurrentlyInClass: isCurrentlyInPeriod,
        currentPeriod,
      })

      setBellCountdown(formatCountdown(timeUntil))
    }

    updateTime() // Initial call
    updateBellCountdown() // Initial call

    const timeInterval = setInterval(updateTime, 60000) // Update every minute
    const bellInterval = setInterval(updateBellCountdown, 1000) // Update every second

    return () => {
      clearInterval(timeInterval)
      clearInterval(bellInterval)
    }
  }, [bellTimes, currentDay])

  // Avoid hydration mismatch
  if (!mounted) return null

  return (
    <PageTransition>
      {/* Welcome Popup for new users */}
      <WelcomePopup isAuthenticated={isAuthenticated} />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
        {/* Header Section - Compact */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4">
          <div className="flex justify-between items-center mb-3 fade-in">
            <div>
              <h1 className="text-xl font-bold">Schedul</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Built For Sydney Boys High School</p>
            </div>
            <div className="flex gap-2">
              <SettingsMenu />
              <ThemeToggle />
            </div>
          </div>

          {/* Personal Greeting - Compact */}
          <div className="slide-up">
            {isAuthenticated ? (
              <>
                <h2 className="text-2xl font-bold theme-gradient">Hi, {studentName}!</h2>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate()} • {currentDay}
                  </p>
                  <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    <Wifi className="h-3 w-3" />
                    <span>Connected</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold theme-gradient">Welcome!</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Explore your school schedule</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate()} • {currentDay}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Main Content - Compact Layout */}
        <div className="p-4 space-y-4">
          {/* Top Row - Sign In Benefits (if not authenticated) */}
          {!isAuthenticated && (
            <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 hover-scale backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="rounded-full p-2 bg-theme-secondary text-theme-primary">
                        <User className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-lg">Personalize Your Experience</h3>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-theme-primary mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Your Real Timetable:</strong> See your actual classes, teachers, and rooms
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-theme-primary mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Personal Notices:</strong> Get notices relevant to your year group
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-theme-primary mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Award Points:</strong> Track your actual recognition points and nominations
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-theme-secondary rounded-xl p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                        Currently viewing demo data. Sign in to see your personal information.
                      </p>
                    </div>

                    <Link href="/auth">
                      <Button className="w-full rounded-xl bg-theme-primary hover:opacity-90 h-12 text-base">
                        <ExternalLink className="h-5 w-5 mr-2" />
                        Connect SBHS Portal
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* At a Glance Card - Combined with Live Bell Countdown */}
          <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 hover-scale backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full p-2 bg-theme-secondary text-theme-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg">At a Glance</h3>
                </div>
                <div className="text-sm font-medium bg-theme-secondary text-theme-primary px-3 py-1 rounded-full">
                  {currentTime}
                </div>
              </div>

              <div className="space-y-4">
                {/* Live Bell Countdown Section */}
                <div>
                  {!isWithinSchoolHours() ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Outside school hours</p>
                    </div>
                  ) : !bellInfo.nextBell && !bellInfo.currentPeriod ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No more bells today</p>
                    </div>
                  ) : bellInfo.isCurrentlyInClass ? (
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Current period ends in:</p>
                          <p className="font-semibold text-sm">{bellInfo.currentPeriod?.period}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                            {bellCountdown}
                          </div>
                        </div>
                      </div>
                      {bellInfo.nextBell && (
                        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                          Next: {bellInfo.nextBell.period}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-theme-secondary rounded-xl p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Next bell in:</p>
                          <p className="font-semibold text-sm">{bellInfo.nextBell?.period}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-theme-primary font-mono">{bellCountdown}</div>
                        </div>
                      </div>
                      {bellInfo.nextBell && (
                        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                          Starts at {formatTimeTo12Hour(bellInfo.nextBell.time.split(" - ")[0] || "")}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Current/Next Class Section with Timetable Data */}
                <div>
                  {nextPeriodInfo.isCurrentlyInClass && nextPeriodInfo.currentPeriod ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Currently in:</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-base">{nextPeriodInfo.currentPeriod.subject}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {nextPeriodInfo.currentPeriod.room} • {nextPeriodInfo.currentPeriod.teacher}
                            {!isAuthenticated && <span className="ml-1 text-blue-500">(Demo)</span>}
                          </p>
                        </div>
                      </div>
                      {nextPeriodInfo.nextPeriod && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Next: {nextPeriodInfo.nextPeriod.subject} in {nextPeriodInfo.nextPeriod.room}
                            {!isAuthenticated && <span className="ml-1 text-blue-500">(Demo)</span>}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : nextPeriodInfo.nextPeriod ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Next up:</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-base">{nextPeriodInfo.nextPeriod.subject}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {nextPeriodInfo.nextPeriod.room} • {nextPeriodInfo.nextPeriod.teacher}
                            {!isAuthenticated && <span className="ml-1 text-blue-500">(Demo)</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                      <p className="text-gray-500 dark:text-gray-400 text-base">
                        No more classes today
                        {!isAuthenticated && <span className="ml-1 text-blue-500">(Demo)</span>}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Row - Most Used and Quick Stats */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Most Used Section */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <h3 className="text-lg font-bold">Most Used</h3>
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
              </div>
              <MostUsedCard />
            </div>

            {/* Quick Overview */}
            <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 hover-scale backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-4">Quick Overview</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-theme-secondary rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-theme-primary mb-1">8</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Nominations</div>
                    {!isAuthenticated && <div className="text-xs text-blue-500 mt-1">(Demo)</div>}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1">5</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Classes Today</div>
                    {!isAuthenticated && <div className="text-xs text-blue-500 mt-1">(Demo)</div>}
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">3</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">New Notices</div>
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
