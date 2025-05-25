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
import { ExternalLink, Wifi } from "lucide-react"
import Link from "next/link"

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
      <main className="container max-w-lg mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6 fade-in">
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
        <div className="mb-6 slide-up">
          {isAuthenticated ? (
            <>
              <h2 className="text-3xl font-bold theme-gradient">Hi, {studentName}!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate()} • {currentDay}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold theme-gradient">Hello Student!</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Please Sign In!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formatDate()} • {currentDay}
              </p>
            </>
          )}
        </div>

        {/* Connection Status for Authenticated Users */}
        {isAuthenticated && (
          <div className="mb-4 slide-up">
            <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 w-fit">
              <Wifi className="h-3 w-3" />
              <span>Connected to SBHS Portal</span>
            </div>
          </div>
        )}

        {/* Unauthenticated State */}
        {!isAuthenticated && (
          <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 mb-6 hover-scale backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
            <CardContent className="p-5 text-center">
              <div className="mb-4">
                <div className="mx-auto w-12 h-12 bg-theme-secondary rounded-full flex items-center justify-center mb-3">
                  <ExternalLink className="h-6 w-6 text-theme-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Connect Your Account</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Sign in with your SBHS Student Portal to access your personalized timetable, notices, and more.
                </p>
              </div>
              <Link href="/auth">
                <Button className="rounded-xl bg-theme-primary hover:opacity-90">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Sign in with SBHS Portal
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Bell Countdown */}
        <div className="mb-6 slide-up">
          <BellCountdown />
        </div>

        {/* At a Glance Card */}
        <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 mb-6 hover-scale backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">At a Glance</h3>
              <div className="text-sm font-medium bg-theme-secondary text-theme-primary px-3 py-1 rounded-full">
                {currentTime}
              </div>
            </div>

            <div className="mb-4">
              {isAuthenticated ? (
                // Show personalized content when authenticated
                nextPeriodInfo.isCurrentlyInClass && nextPeriodInfo.currentPeriod ? (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Currently in:</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{nextPeriodInfo.currentPeriod.subject}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {nextPeriodInfo.currentPeriod.period} • {nextPeriodInfo.currentPeriod.room}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-amber-600 dark:text-amber-400 pulse-subtle">
                        {nextPeriodInfo.timeUntil}
                      </div>
                    </div>
                  </div>
                ) : nextPeriodInfo.nextPeriod ? (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Next up:</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{nextPeriodInfo.nextPeriod.subject}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {nextPeriodInfo.nextPeriod.period} • {nextPeriodInfo.nextPeriod.room}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-theme-primary pulse-subtle">
                        {nextPeriodInfo.timeUntil}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No more classes today</p>
                  </div>
                )
              ) : (
                // Show sign-in prompt when not authenticated
                <div className="bg-theme-secondary rounded-xl p-4 text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    Sign in to see your personalized schedule and upcoming classes
                  </p>
                  <Link href="/auth">
                    <Button size="sm" className="rounded-full bg-theme-primary hover:opacity-90">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Most Used Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Most Used</h3>
          <MostUsedCard />
        </div>
      </main>
    </PageTransition>
  )
}
