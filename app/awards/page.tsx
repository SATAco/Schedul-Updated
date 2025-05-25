"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Award, TrendingUp, Medal } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trackSectionUsage } from "@/utils/usage-tracker"
import PageTransition from "@/components/page-transition"

export default function AwardsPage() {
  useEffect(() => {
    // Track awards usage
    trackSectionUsage("awards")
  }, [])

  // Mock data
  const studentPoints = {
    total: 75,
    nextAward: 100,
    progress: 75,
  }

  const categories = ["All", "Academic", "Sport", "Service", "Arts"]

  const awards = [
    {
      id: 1,
      title: "Mathematics Competition",
      points: 15,
      date: "April 15, 2025",
      category: "Academic",
      description: "High Distinction in the Australian Mathematics Competition",
    },
    {
      id: 2,
      title: "Swimming Carnival",
      points: 10,
      date: "March 10, 2025",
      category: "Sport",
      description: "First place in 50m Freestyle",
    },
    {
      id: 3,
      title: "Debating",
      points: 10,
      date: "February 28, 2025",
      category: "Academic",
      description: "Best speaker in regional debating competition",
    },
    {
      id: 4,
      title: "Community Service",
      points: 20,
      date: "February 15, 2025",
      category: "Service",
      description: "Volunteering at local community center (20 hours)",
    },
    {
      id: 5,
      title: "Music Performance",
      points: 15,
      date: "January 30, 2025",
      category: "Arts",
      description: "Solo performance at school concert",
    },
    {
      id: 6,
      title: "Cross Country",
      points: 5,
      date: "January 20, 2025",
      category: "Sport",
      description: "Participation in school cross country event",
    },
  ]

  return (
    <PageTransition>
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-gray-500 dark:text-gray-400">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Award Points</h1>
          <div className="w-6"></div> {/* Empty div for spacing */}
        </div>

        <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md p-5 border border-gray-100 dark:border-gray-800 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Total Points</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current progress</p>
              </div>
            </div>
            <div className="text-2xl font-bold">{studentPoints.total}</div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress to Bronze Award</span>
              <span>{studentPoints.progress}%</span>
            </div>
            <Progress value={studentPoints.progress} className="h-2" />
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {studentPoints.nextAward - studentPoints.total} more points needed
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col items-center">
              <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-2">
                <Medal className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Bronze</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">100 pts</p>
            </div>
          </Card>

          <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col items-center">
              <div className="rounded-full p-2 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 mb-2">
                <Medal className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Silver</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">200 pts</p>
            </div>
          </Card>

          <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col items-center">
              <div className="rounded-full p-2 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 mb-2">
                <Medal className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Gold</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">300 pts</p>
            </div>
          </Card>
        </div>

        <h2 className="text-xl font-semibold mb-4">Award History</h2>

        <Tabs defaultValue="All" className="mb-6">
          <TabsList className="grid grid-cols-5 mb-4">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="space-y-4">
                {awards
                  .filter((award) => category === "All" || award.category === category)
                  .map((award) => (
                    <Card
                      key={award.id}
                      className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md p-4 border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{award.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{award.date}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-xs font-medium">+{award.points}</span>
                        </div>
                      </div>
                      <p className="text-sm">{award.description}</p>
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                          {award.category}
                        </span>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageTransition>
  )
}
