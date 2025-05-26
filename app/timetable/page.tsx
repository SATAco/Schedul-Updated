"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, ArrowLeftRight, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentDay, formatDate, getCurrentTime } from "@/utils/time-utils"
import { trackSectionUsage } from "@/utils/usage-tracker"
import PageTransition from "@/components/page-transition"
import { useTimetable } from "@/contexts/timetable-context"

export default function TimetablePage() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const { currentWeek, setCurrentWeek, selectedDay, setSelectedDay, timetableData, nextPeriodInfo } = useTimetable()

  // Animation state
  const [slide, setSlide] = useState(false)
  const prevDayRef = useRef<string>(selectedDay)

  // Days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  // Get actual current day
  const actualCurrentDay = getCurrentDay()
  const currentDate = formatDate()

  useEffect(() => {
    setMounted(true)

    // Track timetable usage
    trackSectionUsage("timetable")

    // Update time every minute
    const updateTime = () => {
      setCurrentTime(getCurrentTime())
    }

    updateTime() // Initial call

    const interval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Slide animation when day changes
  useEffect(() => {
    if (prevDayRef.current !== selectedDay) {
      setSlide(true)
      const timeout = setTimeout(() => {
        setSlide(false)
      }, 700) // match with CSS duration
      prevDayRef.current = selectedDay
      return () => clearTimeout(timeout)
    }
  }, [selectedDay])

  const toggleWeek = () => {
    setCurrentWeek(currentWeek === "A" ? "B" : "A")
  }

  const selectPreviousDay = () => {
    const currentIndex = days.indexOf(selectedDay)
    if (currentIndex > 0) {
      setSelectedDay(days[currentIndex - 1])
    }
  }

  const selectNextDay = () => {
    const currentIndex = days.indexOf(selectedDay)
    if (currentIndex < days.length - 1) {
      setSelectedDay(days[currentIndex + 1])
    }
  }

  return (
    <PageTransition>
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 fade-in">
          <Link
            href="/"
            className="text-gray-500 dark:text-gray-400 transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Timetable</h1>
          <div className="w-6"></div>
        </div>

        {/* Current Time Display */}
        {mounted && (
          <div className="flex justify-center mb-4 fade-in">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">{currentTime}</span>
            </div>
          </div>
        )}

        {/* At a Glance for Today */}
        {selectedDay === actualCurrentDay &&
          mounted &&
          (nextPeriodInfo.isCurrentlyInClass || nextPeriodInfo.nextPeriod) && (
            <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 mb-4 slide-up">
              <div className="p-4">
                {nextPeriodInfo.isCurrentlyInClass && nextPeriodInfo.currentPeriod ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Currently in:</p>
                      <p className="font-semibold">{nextPeriodInfo.currentPeriod.subject}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {nextPeriodInfo.currentPeriod.room} • {nextPeriodInfo.currentPeriod.teacher}
                      </p>
                    </div>
                    <div className="text-sm font-medium bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 rounded-full pulse-subtle">
                      {nextPeriodInfo.timeUntil}
                    </div>
                  </div>
                ) : nextPeriodInfo.nextPeriod ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Next up:</p>
                      <p className="font-semibold">{nextPeriodInfo.nextPeriod.subject}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {nextPeriodInfo.nextPeriod.room} • {nextPeriodInfo.nextPeriod.teacher}
                      </p>
                    </div>
                    <div className="text-sm font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full pulse-subtle">
                      {nextPeriodInfo.timeUntil}
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>
          )}

        {/* Week A/B Toggle */}
        <div className="flex justify-center mb-4">
          <Button
            onClick={toggleWeek}
            variant="outline"
            className="rounded-full flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span
              className={`inline-block w-5 h-5 rounded-full ${
                currentWeek === "A" ? "bg-blue-600" : "bg-amber-500"
              } mr-1 transition-all duration-300 ease-in-out`}
            ></span>
            Week {currentWeek}
            <ArrowLeftRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition-all duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={selectPreviousDay}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <h2 className="font-semibold">{selectedDay}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentDate}</p>
          </div>
          <button
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition-all duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={selectNextDay}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <Tabs value={selectedDay} onValueChange={setSelectedDay} className="mb-6">
          <TabsList className="grid grid-cols-5 mb-4">
            {days.map((day) => (
              <TabsTrigger key={day} value={day} className="text-xs transition-all duration-200 ease-in-out">
                {day.substring(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className={`slide-timetable ${slide ? "slide-out" : "slide-in"}`}>
            {days.map((day) => (
              <TabsContent key={day} value={day} className="transition-all duration-300 ease-in-out">
                <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md p-5 border border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out">
                  {timetableData[day].length > 0 ? (
                    timetableData[day].map((period) => (
                      <div
                        key={period.id}
                        className={`py-3 border-b last:border-0 border-gray-100 dark:border-gray-800 transition-all duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                          period.subject === "Break" ? "bg-gray-50 dark:bg-gray-900/50" : ""
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="w-16 mr-3">
                            <p className="font-semibold">{period.period}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{period.time}</p>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{period.subject}</p>
                            {period.subject !== "Break" && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {period.teacher} • {period.room}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No classes scheduled for this day
                    </div>
                  )}
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentWeek === "A" ? "Week A" : "Week B"}: {currentDate.split(",")[0]}
          </p>
        </div>
      </div>
    </PageTransition>
  )
}
