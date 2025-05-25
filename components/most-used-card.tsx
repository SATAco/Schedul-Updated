"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { NavItem } from "@/components/bottom-nav"
import { getMostUsedSection } from "@/utils/usage-tracker"
import { Calendar, Bell, Clock, Clipboard, Award, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/utils/time-utils"
import { useTimetable } from "@/contexts/timetable-context"
import { getCurrentDay } from "@/utils/time-utils"
import { formatTimeTo12Hour } from "@/utils/bell-utils"

// Mock data for different sections
const notices = [
  {
    id: 1,
    title: "School Assembly",
    content: "There will be a whole school assembly on Monday at 9:00 AM in the Great Hall.",
    category: "General",
    date: "May 11, 2025",
  },
  {
    id: 2,
    title: "Year 12 Trial Exams",
    content: "Year 12 trial exams will commence on June 1st. Please check the exam timetable on the school website.",
    category: "Senior",
    date: "May 10, 2025",
  },
]

export default function MostUsedCard() {
  const [mostUsed, setMostUsed] = useState<NavItem>("timetable")
  const [mounted, setMounted] = useState(false)
  const { nextPeriodInfo, bellTimes } = useTimetable()
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

    // Determine which section to show based on user preference
    const preferredSection = localStorage.getItem("schedul-most-used-preference")

    if (preferredSection && preferredSection !== "auto") {
      setMostUsed(preferredSection as NavItem)
    } else {
      setMostUsed(getMostUsedSection())
    }
  }, [])

  // Listen for changes to the localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const preferredSection = localStorage.getItem("schedul-most-used-preference")
      if (preferredSection && preferredSection !== "auto") {
        setMostUsed(preferredSection as NavItem)
      } else {
        setMostUsed(getMostUsedSection())
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also check periodically
    const interval = setInterval(() => {
      handleStorageChange()
    }, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (!mounted) return null

  const renderContent = () => {
    switch (mostUsed) {
      case "timetable":
        return (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Today's Classes</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate()}</span>
            </div>
            <div className="space-y-2 mb-3">
              {nextPeriodInfo.isCurrentlyInClass && nextPeriodInfo.currentPeriod ? (
                <div className="bg-theme-secondary rounded-xl p-3">
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
                <div className="bg-theme-secondary rounded-xl p-3">
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
                <div className="bg-theme-secondary rounded-xl p-3 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No more classes today</p>
                </div>
              )}
            </div>
            <Link
              href="/timetable"
              className="flex items-center justify-center text-sm text-theme-primary hover:opacity-80 transition-all duration-200 ease-in-out"
            >
              View full timetable
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </>
        )
      case "notices":
        return (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Latest Notices</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate()}</span>
            </div>
            <div className="space-y-2 mb-3">
              {notices.slice(0, 2).map((notice) => (
                <div key={notice.id} className="bg-theme-secondary rounded-xl p-3">
                  <p className="font-semibold text-sm">{notice.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{notice.content}</p>
                </div>
              ))}
            </div>
            <Link
              href="/notices"
              className="flex items-center justify-center text-sm text-theme-primary hover:opacity-80 transition-all duration-200 ease-in-out"
            >
              View all notices
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </>
        )
      case "bell-times":
        return (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Today's Bell Times</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate()}</span>
            </div>
            <div className="space-y-2 mb-3">
              {bellTimes[getBellTimesSchedule()]?.slice(0, 3).map((bell, index) => (
                <div
                  key={index}
                  className={`bg-theme-secondary rounded-xl p-3 ${
                    bell.period === "Recess" ||
                    bell.period === "Lunch" ||
                    bell.period === "Lunch 1" ||
                    bell.period === "Lunch 2"
                      ? "bg-gray-50 dark:bg-gray-800/50"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm">{bell.period}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimeTo12Hour(bell.time)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/bell-times"
              className="flex items-center justify-center text-sm text-theme-primary hover:opacity-80 transition-all duration-200 ease-in-out"
            >
              View all bell times
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </>
        )
      case "clipboard":
        return (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Clipboard</h3>
            </div>
            <div className="bg-theme-secondary rounded-xl p-3 mb-3 text-center">
              <p className="font-semibold text-sm">School Calendar</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">View your school events and activities</p>
            </div>
            <Link
              href="/clipboard"
              className="flex items-center justify-center text-sm text-theme-primary hover:opacity-80 transition-all duration-200 ease-in-out"
            >
              Open Clipboard
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </>
        )
      case "awards":
        return (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Award Points</h3>
            </div>
            <div className="bg-theme-secondary rounded-xl p-3 mb-3">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm">Total Points</p>
                <p className="text-lg font-bold">75</p>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-theme-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                  25 points until Bronze Award
                </p>
              </div>
            </div>
            <Link
              href="/awards"
              className="flex items-center justify-center text-sm text-theme-primary hover:opacity-80 transition-all duration-200 ease-in-out"
            >
              View all awards
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </>
        )
      default:
        return (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">Select a section to view</p>
          </div>
        )
    }
  }

  const getIcon = () => {
    switch (mostUsed) {
      case "timetable":
        return <Calendar className="h-5 w-5" />
      case "notices":
        return <Bell className="h-5 w-5" />
      case "bell-times":
        return <Clock className="h-5 w-5" />
      case "clipboard":
        return <Clipboard className="h-5 w-5" />
      case "awards":
        return <Award className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  const getTitle = () => {
    switch (mostUsed) {
      case "timetable":
        return "Timetable"
      case "notices":
        return "Daily Notices"
      case "bell-times":
        return "Bells"
      case "clipboard":
        return "Clipboard"
      case "awards":
        return "Award Points"
      default:
        return "Timetable"
    }
  }

  return (
    <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 hover-scale backdrop-blur-card">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full p-2 bg-theme-secondary text-theme-primary">{getIcon()}</div>
          <h2 className="text-lg font-semibold">{getTitle()}</h2>
        </div>
        {renderContent()}
      </CardContent>
    </Card>
  )
}
