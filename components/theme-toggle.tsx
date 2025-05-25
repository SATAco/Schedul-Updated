"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { motion } from "framer-motion"

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle theme toggle with explicit theme values
  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light")
      // Force save to localStorage for mobile
      localStorage.setItem("gdayo-theme-preference", "light")
    } else {
      setTheme("dark")
      // Force save to localStorage for mobile
      localStorage.setItem("gdayo-theme-preference", "dark")
    }
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="rounded-full w-10 h-10 transition-all duration-300 ease-in-out">
        <div className="w-5 h-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full w-10 h-10 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={toggleTheme}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
        transition={{ duration: 0.3 }}
        key={resolvedTheme}
      >
        {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.div>
    </Button>
  )
}
