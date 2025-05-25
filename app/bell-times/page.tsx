"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trackSectionUsage } from "@/utils/usage-tracker"
import PageTransition from "@/components/page-transition"
import { useTimetable } from "@/contexts/timetable-context"
import BellCountdown from "@/components/bell-countdown"
import { formatDate } from "@/utils/time-utils"
import { formatTimeTo12Hour } from "@/utils/bell-utils"

export default function BellTimesPage() {
  const { bellTimes } = useTimetable()

  useEffect(() => {
    // Track bell-times usage
    trackSectionUsage("bell-times")
  }, [])

  // New schedule types
  const scheduleTypes = ["Mon/Tues", "Wed/Thurs", "Fri"]

  return (
    <PageTransition>
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-gray-500 dark:text-gray-400">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Bells</h1>
          <div className="w-6"></div> {/* Empty div for spacing */}
        </div>

        {/* Bell Countdown Timer */}
        <div className="mb-6">
          <BellCountdown />
        </div>

        <Tabs defaultValue="Mon/Tues" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
            {scheduleTypes.map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                className="text-sm rounded-full data-[state=active]:bg-theme-primary data-[state=active]:text-white dark:data-[state=active]:bg-theme-primary data-[state=active]:shadow-sm transition-all duration-200"
              >
                {type}
              </TabsTrigger>
            ))}
          </TabsList>

          {scheduleTypes.map((type) => (
            <TabsContent key={type} value={type}>
              <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{type} Schedule</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {bellTimes[type].map((bell, index) => (
                    <div
                      key={index}
                      className={`rounded-xl p-3 transition-all duration-200 ease-in-out ${
                        bell.period === "Recess" ||
                        bell.period === "Lunch" ||
                        bell.period === "Lunch 1" ||
                        bell.period === "Lunch 2" ||
                        bell.period === "End of Day"
                          ? "bg-gray-50 dark:bg-gray-800/50"
                          : "bg-theme-secondary"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-sm">{bell.period}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimeTo12Hour(bell.time)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageTransition>
  )
}
