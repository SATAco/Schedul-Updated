"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Sparkles, Calendar, Bell, Award, Clock, Clipboard, Plus, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface WelcomePopupProps {
  isAuthenticated: boolean
}

export default function WelcomePopup({ isAuthenticated }: WelcomePopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentDemo, setCurrentDemo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    // Only show for unauthenticated users
    if (!isAuthenticated) {
      const hasSeenWelcome = localStorage.getItem("schedul-welcome-seen")
      if (!hasSeenWelcome) {
        // Small delay for better UX
        const timer = setTimeout(() => {
          setIsVisible(true)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [isAuthenticated])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("schedul-welcome-seen", "true")
  }

  const demos = [
    {
      title: "Smart Timetable",
      description: "See your current class and next period",
      color: "bg-blue-500",
      accentColor: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-600 dark:text-blue-400",
      mockData: {
        current: "Mathematics",
        room: "Room 304",
        timeLeft: "25 min",
        next: "Science",
      },
    },
    {
      title: "Bell Countdown",
      description: "Live countdown to next bell",
      color: "bg-amber-500",
      accentColor: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-600 dark:text-amber-400",
      mockData: {
        period: "Period 3",
        countdown: "12:34",
        status: "ends in",
      },
    },
    {
      title: "Daily Notices",
      description: "Stay updated with school announcements",
      color: "bg-green-500",
      accentColor: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-600 dark:text-green-400",
      mockData: {
        notices: ["School Assembly", "Sports Carnival", "Parent Meeting"],
      },
    },
    {
      title: "Award Points",
      description: "Track your recognition and nominations",
      color: "bg-purple-500",
      accentColor: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-600 dark:text-purple-400",
      mockData: {
        total: "8",
        progress: 65,
        nextAward: "Gold Award",
      },
    },
    {
      title: "School Calendar",
      description: "Access Clipboard integration",
      color: "bg-teal-500",
      accentColor: "bg-teal-100 dark:bg-teal-900/30",
      textColor: "text-teal-600 dark:text-teal-400",
      mockData: {
        events: ["Sports Day", "Exam Week", "Holiday"],
      },
    },
  ]

  // Auto-advance demo
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demos.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [isPlaying, demos.length])

  const renderIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Calendar className="h-4 w-4" />
      case 1:
        return <Clock className="h-4 w-4" />
      case 2:
        return <Bell className="h-4 w-4" />
      case 3:
        return <Award className="h-4 w-4" />
      case 4:
        return <Clipboard className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const renderDemo = (demo: (typeof demos)[0], index: number) => {
    switch (index) {
      case 0: // Smart Timetable
        return (
          <div className="space-y-2">
            <div className={`${demo.accentColor} rounded-lg p-2`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Currently in:</p>
                  <p className="font-semibold text-sm">{demo.mockData.current}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{demo.mockData.room}</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className={`text-sm font-bold ${demo.textColor}`}
                >
                  {demo.mockData.timeLeft}
                </motion.div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Next: {demo.mockData.next}</p>
            </div>
          </div>
        )

      case 1: // Bell Countdown
        return (
          <div className={`${demo.accentColor} rounded-lg p-3 text-center`}>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{demo.mockData.period}</p>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className={`text-xl font-bold font-mono ${demo.textColor} mb-1`}
            >
              {demo.mockData.countdown}
            </motion.div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{demo.mockData.status}</p>
          </div>
        )

      case 2: // Daily Notices
        return (
          <div className="space-y-1.5">
            {demo.mockData.notices.map((notice, noticeIndex) => (
              <motion.div
                key={notice}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: noticeIndex * 0.3 }}
                className={`${demo.accentColor} rounded-lg p-2`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${demo.color}`}></div>
                  <p className="text-xs font-medium">{notice}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )

      case 3: // Award Points
        return (
          <div className={`${demo.accentColor} rounded-lg p-3`}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Nominations</p>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className={`text-lg font-bold ${demo.textColor}`}
              >
                {demo.mockData.total}
              </motion.div>
            </div>
            <div className="space-y-1">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <motion.div
                  className={`h-1.5 rounded-full ${demo.color}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${demo.mockData.progress}%` }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                ></motion.div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Progress to {demo.mockData.nextAward}
              </p>
            </div>
          </div>
        )

      case 4: // School Calendar
        return (
          <div className="space-y-1.5">
            {demo.mockData.events.map((event, eventIndex) => (
              <motion.div
                key={event}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: eventIndex * 0.4 }}
                className={`${demo.accentColor} rounded-lg p-2 flex items-center gap-2`}
              >
                <div className={`w-2.5 h-2.5 rounded ${demo.color}`}></div>
                <p className="text-xs font-medium">{event}</p>
              </motion.div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl"
        >
          <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-theme-primary to-theme-primary-dark p-4 text-white">
                <button
                  onClick={handleDismiss}
                  className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex items-center justify-center gap-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.div>
                  <div className="text-left">
                    <h1 className="text-xl font-bold">Welcome to Schedul</h1>
                    <p className="text-white/90 text-sm">Your SBHS companion app</p>
                  </div>
                </div>
              </div>

              {/* Main Content - Horizontal Layout */}
              <div className="p-4">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Side - Demo */}
                  <div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentDemo}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-3"
                      >
                        {/* Feature Header */}
                        <div className="flex items-center gap-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className={`rounded-full p-2 ${demos[currentDemo].accentColor} ${demos[currentDemo].textColor}`}
                          >
                            {renderIcon(currentDemo)}
                          </motion.div>
                          <div>
                            <h3 className="font-semibold text-sm">{demos[currentDemo].title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{demos[currentDemo].description}</p>
                          </div>
                        </div>

                        {/* Demo Content */}
                        <div className="min-h-[100px] flex items-center">
                          {renderDemo(demos[currentDemo], currentDemo)}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Progress Indicator */}
                    <div className="flex justify-center gap-1 mt-4">
                      {demos.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentDemo
                              ? "bg-theme-primary w-6"
                              : index < currentDemo
                                ? "bg-theme-primary/50 w-1.5"
                                : "bg-gray-300 dark:bg-gray-600 w-1.5"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Controls */}
                    <div className="flex justify-between items-center mt-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        {isPlaying ? "Pause" : "Play"}
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentDemo((prev) => (prev - 1 + demos.length) % demos.length)}
                          className="p-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <ArrowRight className="h-3 w-3 rotate-180" />
                        </button>
                        <button
                          onClick={() => setCurrentDemo((prev) => (prev + 1) % demos.length)}
                          className="p-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex flex-col justify-center">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Get Started</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          Connect your SBHS portal to see your real data, or explore with demo content.
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Link href="/auth" onClick={handleDismiss}>
                          <Button className="w-full rounded-xl bg-theme-primary hover:opacity-90 h-11 text-sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Connect SBHS Portal
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          onClick={handleDismiss}
                          className="w-full rounded-xl h-11 text-sm border-gray-200 dark:border-gray-700"
                        >
                          Explore with Demo Data
                        </Button>
                      </div>

                      {/* Skip Option */}
                      <div className="text-center">
                        <button
                          onClick={handleDismiss}
                          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          Skip tour
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
