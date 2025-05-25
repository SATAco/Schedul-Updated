"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getCurrentTime, getCurrentDay, formatDate } from "@/utils/time-utils"
import MostUsedCard from "@/components/most-used-card"
import { trackSectionUsage } from "@/utils/usage-tracker"
import ThemeToggle from "@/components/theme-toggle"
import PageTransition from "@/components/page-transition"
import SettingsMenu from "@/components/settings-menu"
import { useTimetable } from "@/contexts/timetable-context"
import BellCountdown from "@/components/bell-countdown"
import { useUserSettings } from "@/components/theme-provider"

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [mounted, setMounted] = useState(false)
  const { nextPeriodInfo } = useTimetable()
  const { colorTheme } = useUserSettings()

  // Mock student data
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

  // Get color theme classes
  const getThemeColorClass = () => {
    switch (colorTheme) {
      case "purple":
        return "bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-500 dark:to-purple-700"
      case "green":
        return "bg-gradient-to-r from-green-600 to-green-800 dark:from-green-500 dark:to-green-700"
      case "red":
        return "bg-gradient-to-r from-red-600 to-red-800 dark:from-red-500 dark:to-red-700"
      case "orange":
        return "bg-gradient-to-r from-orange-600 to-orange-800 dark:from-orange-500 dark:to-orange-700"
      default:
        return "bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700"
    }
  }

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

        {/* Personal Greeting */}
        <div className="mb-6 slide-up">
          <h2 className={`text-3xl font-bold bg-clip-text text-transparent ${getThemeColorClass()}`}>
            Hi, {studentName}!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate()} • {currentDay}
          </p>
        </div>

        {/* Bell Countdown */}
        <div className="mb-6 slide-up">
          <BellCountdown />
        </div>

        {/* At a Glance Card */}
        <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 mb-6 hover-scale backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">At a Glance</h3>
              <div className="text-sm font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full">
                {currentTime}
              </div>
            </div>

            <div className="mb-4">
              {nextPeriodInfo.isCurrentlyInClass && nextPeriodInfo.currentPeriod ? (
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
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 pulse-subtle">
                      {nextPeriodInfo.timeUntil}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No more classes today</p>
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
