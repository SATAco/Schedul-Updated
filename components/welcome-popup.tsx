"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Sparkles, Calendar, Bell, Award, Clipboard, Eye, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface WelcomePopupProps {
  isAuthenticated: boolean
}

export default function WelcomePopup({ isAuthenticated }: WelcomePopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

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

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Beautiful UI Design",
      description:
        "Clean, modern interface designed specifically for SBHS students with smooth animations and intuitive navigation.",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Smart Timetable",
      description:
        "View your class schedule with real-time updates, current period tracking, and countdown to next class.",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "At a Glance",
      description: "See what's happening now and next with live bell countdowns and current class information.",
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Daily Notices",
      description:
        "Stay updated with school announcements, events, and important information filtered by your year group.",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      icon: <Clipboard className="h-6 w-6" />,
      title: "Clipboard Integration",
      description: "Seamlessly access your school calendar and events through integrated Clipboard functionality.",
      color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Award Scheme Tracking",
      description:
        "Monitor your recognition points, nominations, and progress towards Bronze, Silver, Gold awards and beyond.",
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length)
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
          className="w-full max-w-md"
        >
          <Card className="rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-theme-primary to-theme-primary-dark p-6 text-white">
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4"
                  >
                    <Sparkles className="h-8 w-8" />
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-2"
                  >
                    Welcome to Schedul
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/90 text-sm"
                  >
                    Your all-in-one SBHS companion app
                  </motion.p>
                </div>
              </div>

              {/* Feature Carousel */}
              <div className="p-6">
                <div className="relative h-48 mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute inset-0 ${features[currentSlide].bgColor} rounded-xl p-4 flex flex-col justify-center`}
                    >
                      <div className={`rounded-full p-3 ${features[currentSlide].color} w-fit mb-3`}>
                        {features[currentSlide].icon}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{features[currentSlide].title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {features[currentSlide].description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Dots Indicator */}
                  <div className="flex gap-2">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentSlide
                            ? "bg-theme-primary w-6"
                            : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href="/auth" onClick={handleDismiss}>
                    <Button className="w-full rounded-xl bg-theme-primary hover:opacity-90 h-12 text-base font-medium">
                      <Plus className="h-5 w-5 mr-2" />
                      Connect Your SBHS Account
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    onClick={handleDismiss}
                    className="w-full rounded-xl h-12 text-base font-medium border-gray-200 dark:border-gray-700"
                  >
                    Explore with Demo Data
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    All features work without signing in • Connect for personalized experience
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
