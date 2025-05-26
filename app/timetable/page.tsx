"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, ArrowLeftRight, Clock, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentDay, formatDate, getCurrentTime } from "@/utils/time-utils"
import { trackSectionUsage } from "@/utils/usage-tracker"
import PageTransition from "@/components/page-transition"
import { useTimetable } from "@/contexts/timetable-context"

type Period = {
  id: string
  period: string
  subject: string
  teacher?: string
  room?: string
  time: string
}

type TimetableData = {
  [day: string]: Period[]
}

type NextPeriodInfo = {
  isCurrentlyInClass: boolean
  currentPeriod?: Period
  nextPeriod?: Period
  timeUntil?: string
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

function AtAGlanceCard({ nextPeriodInfo }: { nextPeriodInfo: NextPeriodInfo }) {
  if (
    !nextPeriodInfo ||
    (!nextPeriodInfo.isCurrentlyInClass && !nextPeriodInfo.nextPeriod)
  ) {
    return null
  }
  return (
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
  )
}

function PeriodCard({ period }: { period: Period }) {
  return (
    <div
      key={period.id}
      className={`rounded-xl p-3 transition-all duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
        period.subject === "Break" ? "bg-gray-50 dark:bg-gray-800/50" : "bg-theme-secondary"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12">
              <p className="font-semibold text-sm">{period.period}</p>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{period.subject}</p>
              {period.subject !== "Break" && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {period.teacher} • {period.room}
                </p>
              )}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">{period.time}</p>
      </div>
    </div>
  )
}

export default function TimetablePage() {
  const [currentTime, setCurrentTime] = useState(getCurrentTime())
  const {
    currentWeek,
    setCurrentWeek,
    selectedDay,
    setSelectedDay,
    timetableData,
    nextPeriodInfo
  } = useTimetable() as {
    currentWeek: "A" | "B"
    setCurrentWeek: (w: "A" | "B") => void
    selectedDay: string
    setSelectedDay: (d: string) => void
    timetableData: TimetableData
    nextPeriodInfo: NextPeriodInfo
  }

  const actualCurrentDay = getCurrentDay()
  const currentDate = useMemo(() => formatDate(), [])

  useEffect(() => {
    trackSectionUsage("timetable")
    const tick = () => setCurrentTime(getCurrentTime())
    const interval = setInterval(tick, 60000)
    return () => clearInterval(interval)
  }, [])

  const toggleWeek = useCallback(() => {
    setCurrentWeek(currentWeek === "A" ? "B" : "A")
  }, [currentWeek, setCurrentWeek])

  const selectPreviousDay = useCallback(() => {
    const currentIndex = days.indexOf(selectedDay)
    if (currentIndex > 0) setSelectedDay(days[currentIndex - 1])
  }, [selectedDay, setSelectedDay])

  const selectNextDay = useCallback(() => {
    const currentIndex = days.indexOf(selectedDay)
    if (currentIndex < days.length - 1) setSelectedDay(days[currentIndex + 1])
  }, [selectedDay, setSelectedDay])

  return (
    <PageTransition>
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 fade-in">
          <Link
            href="/"
            className="text-gray-500 dark:text-gray-400 transition-all duration-200 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Go to home"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Timetable</h1>
          <div className="w-6" />
        </div>

        {/* Current Time Display */}
        <div className="flex justify-center mb-4 fade-in">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium">{currentTime}</span>
          </div>
        </div>

        {/* "At a Glance" for Today */}
        {selectedDay === actualCurrentDay && (
          <AtAGlanceCard nextPeriodInfo={nextPeriodInfo} />
        )}

        {/* Week A/B Toggle */}
        <div className="flex justify-center mb-4">
          <Button
            onClick={toggleWeek}
            variant="outline"
            className="rounded-full flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={`Switch to Week ${currentWeek === "A" ? "B" : "A"}`}
          >
            <span
              className={`inline-block w-5 h-5 rounded-full ${
                currentWeek === "A" ? "bg-blue-600" : "bg-amber-500"
              } mr-1 transition-all duration-300 ease-in-out`}
            />
            Week {currentWeek}
            <ArrowLeftRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition-all duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={selectPreviousDay}
            aria-label="Previous day"
            disabled={selectedDay === days[0]}
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
            aria-label="Next day"
            disabled={selectedDay === days[days.length - 1]}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <Tabs value={selectedDay} onValueChange={setSelectedDay} className="mb-6">
          <TabsList className="grid grid-cols-5 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
            {days.map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="text-xs rounded-full data-[state=active]:bg-theme-primary data-[state=active]:text-white dark:data-[state=active]:bg-theme-primary data-[state=active]:shadow-sm transition-all"
                aria-label={`Select ${day}`}
              >
                {day.substring(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>
          {days.map((day) => (
            <TabsContent key={day} value={day} className="transition-all duration-300 ease-in-out">
              <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full p-2 bg-theme-secondary text-theme-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{day} Schedule</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate()}</p>
                  </div>
                </div>
                {(timetableData?.[day]?.length ?? 0) > 0 ? (
                  <div className="space-y-2">
                    {timetableData[day].map((period) => (
                      <PeriodCard key={period.id} period={period} />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    No classes scheduled for this day
                  </div>
                )}
              </Card>
            </TabsContent>
          ))}
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
