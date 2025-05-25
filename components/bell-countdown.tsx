"use client"

import { useState, useEffect } from "react"
import { useTimetable } from "@/contexts/timetable-context"
import { getNextBell, formatCountdown, formatTimeTo12Hour } from "@/utils/bell-utils"
import { getCurrentDay, isWithinSchoolHours } from "@/utils/time-utils"
import { Clock, Bell } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function BellCountdown() {
  const { bellTimes } = useTimetable()
  const [countdown, setCountdown] = useState("00:00")
  const [nextBellInfo, setNextBellInfo] = useState<{
    nextBell: { period: string; time: string } | null
    isCurrentlyInPeriod: boolean
    currentPeriod: { period: string; time: string } | null
  }>({
    nextBell: null,
    isCurrentlyInPeriod: false,
    currentPeriod: null,
  })

  // Determine which bell times schedule to use based on the current day
  const getBellTimesSchedule = () => {
    const currentDay = getCurrentDay()
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
    const updateCountdown = () => {
      const currentSchedule = getBellTimesSchedule()
      const currentBellTimes = bellTimes[currentSchedule]

      if (!currentBellTimes) return

      const { nextBell, timeUntil, isCurrentlyInPeriod, currentPeriod } = getNextBell(currentBellTimes)

      setNextBellInfo({
        nextBell,
        isCurrentlyInPeriod,
        currentPeriod,
      })

      setCountdown(formatCountdown(timeUntil))
    }

    // Update immediately
    updateCountdown()

    // Then update every second
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [bellTimes])

  if (!isWithinSchoolHours()) {
    return (
      <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-full p-2 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <Clock className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold">Next Bell in...</h2>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">Outside school hours</p>
        </div>
      </Card>
    )
  }

  if (!nextBellInfo.nextBell && !nextBellInfo.currentPeriod) {
    return (
      <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-full p-2 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <Clock className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold">Next Bell in...</h2>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">No more bells today</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 p-5">
      {nextBellInfo.isCurrentlyInPeriod ? (
        <>
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-full p-2 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Next Bell in...</h2>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">{nextBellInfo.currentPeriod?.period}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ends in</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2 font-mono">{countdown}</div>
            </div>
            {nextBellInfo.nextBell && (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Next: {nextBellInfo.nextBell.period} at {formatTimeTo12Hour(nextBellInfo.nextBell.time.split(" - ")[0])}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Bell className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">Next Bell in...</h2>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">{nextBellInfo.nextBell?.period}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Starts in</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 font-mono">{countdown}</div>
            </div>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Starts at {formatTimeTo12Hour(nextBellInfo.nextBell?.time.split(" - ")[0] || "")}
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
