"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Award, TrendingUp, Medal, Trophy, Star, Download } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trackSectionUsage } from "@/utils/usage-tracker"
import PageTransition from "@/components/page-transition"

export default function AwardsPage() {
  useEffect(() => {
    // Track awards usage
    trackSectionUsage("awards")
  }, [])

  // SBHS Student Recognition and Awards Scheme - category-based nominations
  const categoryData = {
    Academic: { points: 85, nominations: 2 }, // 85 points = 2 nominations (30+30+25 remaining)
    Sports: { points: 45, nominations: 1 }, // 45 points = 1 nomination (30+15 remaining)
    "Co-Curricular Teams": { points: 50, nominations: 1 }, // 50 points = 1 nomination (30+20 remaining)
    "Performing Arts": { points: 22, nominations: 0 }, // 22 points = 0 nominations (need 8 more)
    "High Spirit": { points: 35, nominations: 1 }, // 35 points = 1 nomination (30+5 remaining)
    Service: { points: 45, nominations: 1 }, // 45 points = 1 nomination (30+15 remaining)
    Leadership: { points: 60, nominations: 2 }, // 60 points = 2 nominations (30+30)
  }

  // Calculate total nominations across all categories
  const totalNominations = Object.values(categoryData).reduce((sum, cat) => sum + cat.nominations, 0)
  const totalPoints = Object.values(categoryData).reduce((sum, cat) => sum + cat.points, 0)

  // SBHS Award categories from the official scheme
  const categories = [
    "All",
    "Academic",
    "Sports",
    "Co-Curricular Teams",
    "Performing Arts",
    "High Spirit",
    "Service",
    "Leadership",
  ]

  // Recent points earned (realistic SBHS activities) - organized by category
  const recentPoints = [
    {
      id: 1,
      title: "Mathematics Competition - High Distinction",
      points: 25,
      date: "April 15, 2025",
      category: "Academic",
      description: "Outstanding performance in Australian Mathematics Competition",
    },
    {
      id: 2,
      title: "English Essay Competition - 1st Place",
      points: 30,
      date: "March 20, 2025",
      category: "Academic",
      description: "First place in annual English essay writing competition",
    },
    {
      id: 3,
      title: "Science Fair - Excellence Award",
      points: 30,
      date: "February 10, 2025",
      category: "Academic",
      description: "Excellence award for innovative science project",
    },
    {
      id: 4,
      title: "House Swimming Carnival Participation",
      points: 15,
      date: "March 10, 2025",
      category: "Sports",
      description: "Active participation in annual house swimming carnival",
    },
    {
      id: 5,
      title: "Cross Country - House Champion",
      points: 30,
      date: "February 5, 2025",
      category: "Sports",
      description: "House champion in annual cross country event",
    },
    {
      id: 6,
      title: "Debating Team - Regional Competition",
      points: 20,
      date: "February 28, 2025",
      category: "Co-Curricular Teams",
      description: "Representing school in regional debating competition",
    },
    {
      id: 7,
      title: "Chess Team - State Finals",
      points: 30,
      date: "January 15, 2025",
      category: "Co-Curricular Teams",
      description: "Competing in state chess championship finals",
    },
    {
      id: 8,
      title: "School Concert Performance",
      points: 12,
      date: "December 10, 2024",
      category: "Performing Arts",
      description: "Solo performance in annual school concert",
    },
    {
      id: 9,
      title: "Drama Production - Lead Role",
      points: 10,
      date: "November 20, 2024",
      category: "Performing Arts",
      description: "Lead role in school drama production",
    },
    {
      id: 10,
      title: "School Spirit - Assembly Participation",
      points: 5,
      date: "February 15, 2025",
      category: "High Spirit",
      description: "Demonstrating school spirit during weekly assembly",
    },
    {
      id: 11,
      title: "House Spirit - Carnival Support",
      points: 30,
      date: "January 25, 2025",
      category: "High Spirit",
      description: "Outstanding house spirit and support during sports carnival",
    },
    {
      id: 12,
      title: "Community Service - Local Charity",
      points: 15,
      date: "January 20, 2025",
      category: "Service",
      description: "Volunteering at local community charity event",
    },
    {
      id: 13,
      title: "Environmental Club - Tree Planting",
      points: 30,
      date: "December 5, 2024",
      category: "Service",
      description: "Leading environmental club tree planting initiative",
    },
    {
      id: 14,
      title: "Peer Support Leader",
      points: 30,
      date: "January 30, 2025",
      category: "Leadership",
      description: "Leading Year 7 peer support group throughout term",
    },
    {
      id: 15,
      title: "SRC Representative",
      points: 30,
      date: "November 10, 2024",
      category: "Leadership",
      description: "Elected Student Representative Council member",
    },
  ]

  // SBHS Award levels based on nominations (from official scheme)
  const awardLevels = [
    { name: "Bronze Award", nominations: 4, color: "bg-amber-600", achieved: totalNominations >= 4 },
    { name: "Silver Award", nominations: 8, color: "bg-gray-400", achieved: totalNominations >= 8 },
    { name: "Gold Award", nominations: 13, color: "bg-yellow-500", achieved: totalNominations >= 13 },
    { name: "Platinum Award", nominations: 18, color: "bg-purple-400", achieved: totalNominations >= 18 },
    { name: "School Plaque", nominations: 24, color: "bg-blue-600", achieved: totalNominations >= 24 },
    { name: "The School Trophy", nominations: 30, color: "bg-green-600", achieved: totalNominations >= 30 },
    { name: "Nathan McDonnell Award", nominations: 37, color: "bg-red-600", achieved: totalNominations >= 37 },
    { name: "Joseph Coates Award", nominations: 44, color: "bg-purple-800", achieved: totalNominations >= 44 },
  ]

  // Find current and next award levels
  const getCurrentLevel = () => {
    let current = null
    let next = null

    for (let i = 0; i < awardLevels.length; i++) {
      if (totalNominations >= awardLevels[i].nominations) {
        current = awardLevels[i]
      } else if (!next) {
        next = awardLevels[i]
        break
      }
    }

    return { current, next }
  }

  const { current: currentLevel, next: nextLevel } = getCurrentLevel()

  return (
    <PageTransition>
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-gray-500 dark:text-gray-400">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Student Awards</h1>
          <div className="w-6"></div>
        </div>

        {/* Overall Progress Card */}
        <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md p-5 border border-gray-100 dark:border-gray-800 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-theme-secondary text-theme-primary">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Total Nominations</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentLevel ? `${currentLevel.name} achieved` : "Working towards first award"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{totalNominations}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">nominations</div>
            </div>
          </div>

          {nextLevel && (
            <>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress to {nextLevel.name}</span>
                  <span>{Math.round((totalNominations / nextLevel.nominations) * 100)}%</span>
                </div>
                <Progress value={(totalNominations / nextLevel.nominations) * 100} className="h-2" />
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {nextLevel.nominations - totalNominations} more nominations needed for {nextLevel.name}
              </div>
            </>
          )}

          {!nextLevel && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                <Trophy className="h-5 w-5" />
                <span className="font-semibold">Highest Award Achieved!</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Congratulations on reaching the Joseph Coates Award
              </p>
            </div>
          )}
        </Card>

        {/* Category Progress Cards - Compact Grid */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Progress by Category</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(categoryData).map(([category, data]) => {
              const pointsToNextNomination = 30 - (data.points % 30)
              const progressToNext = ((data.points % 30) / 30) * 100

              return (
                <Card
                  key={category}
                  className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-md p-3 border border-gray-100 dark:border-gray-800"
                >
                  <div className="text-center mb-2">
                    <h4 className="font-semibold text-xs">{category}</h4>
                    <div className="text-lg font-bold text-theme-primary">{data.nominations}</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{data.points} pts</p>
                  </div>

                  {data.points % 30 !== 0 && (
                    <div>
                      <Progress value={progressToNext} className="h-1.5 mb-1" />
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        +{pointsToNextNomination} for next
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* Award Levels - Compact View */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Award Progress</h3>
          <div className="space-y-2">
            {awardLevels.slice(0, 4).map((level, index) => {
              const isAchieved = level.achieved
              const isCurrent = nextLevel?.name === level.name

              return (
                <Card
                  key={level.name}
                  className={`rounded-xl bg-white dark:bg-gray-900 shadow-sm p-3 border transition-all duration-200 ${
                    isAchieved
                      ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                      : isCurrent
                        ? "border-theme-primary bg-theme-secondary"
                        : "border-gray-100 dark:border-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-full p-1.5 ${
                          isAchieved
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : isCurrent
                              ? "bg-theme-secondary text-theme-primary"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {isAchieved ? (
                          <Trophy className="h-3 w-3" />
                        ) : index < 4 ? (
                          <Medal className="h-3 w-3" />
                        ) : (
                          <Star className="h-3 w-3" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{level.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{level.nominations} nominations</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAchieved && (
                        <span className="text-xs bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                          ✓
                        </span>
                      )}
                      {isCurrent && !isAchieved && (
                        <span className="text-xs bg-theme-secondary text-theme-primary px-2 py-0.5 rounded-full">
                          Next
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}

            {awardLevels.length > 4 && (
              <div className="text-center pt-2">
                <button className="text-sm text-theme-primary hover:opacity-80 transition-opacity">
                  View all {awardLevels.length} award levels →
                </button>
              </div>
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Recent Points Earned</h2>

        <Tabs defaultValue="All" className="mb-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex min-w-full mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="text-xs whitespace-nowrap rounded-full data-[state=active]:bg-theme-primary data-[state=active]:text-white dark:data-[state=active]:bg-theme-primary data-[state=active]:shadow-sm transition-all duration-200"
                >
                  {category === "Co-Curricular Teams" ? "Teams" : category === "Performing Arts" ? "Arts" : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="space-y-3">
                {recentPoints
                  .filter((point) => category === "All" || point.category === category)
                  .slice(0, 6)
                  .map((point) => (
                    <Card
                      key={point.id}
                      className="rounded-xl bg-white dark:bg-gray-900 shadow-sm p-3 border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1 pr-2">
                          <h3 className="font-semibold text-sm leading-tight">{point.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{point.date}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-theme-secondary text-theme-primary px-2 py-1 rounded-full flex-shrink-0">
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-xs font-medium">+{point.points}</span>
                        </div>
                      </div>
                      <p className="text-xs mb-2 text-gray-600 dark:text-gray-300 line-clamp-2">{point.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                          {point.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">→ {point.category}</span>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Information Cards */}
        <div className="space-y-4">
          <Card className="rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full p-1 bg-blue-100 dark:bg-blue-900/30">
                <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">How It Works</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Earn points in each category separately. Every 30 points in a category = 1 nomination for that
                  category. Awards are based on your total nominations across all categories.
                </p>
              </div>
            </div>
          </Card>

          <Card className="rounded-[1.5rem] bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full p-1 bg-green-100 dark:bg-green-900/30">
                <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-900 dark:text-green-100 mb-1">Points Schedule</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                  View the complete points schedule for all activities in each category.
                </p>
                <button className="text-sm text-green-600 dark:text-green-400 hover:opacity-80 transition-opacity flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  Download Points Schedule
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
