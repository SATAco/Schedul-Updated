"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Bell, Clock, Clipboard, Award, Home } from "lucide-react"
import { motion } from "framer-motion"

export type NavItem = "home" | "timetable" | "notices" | "bell-times" | "clipboard" | "awards"

interface BottomNavProps {
  onNavItemClick?: (item: NavItem) => void
}

export default function BottomNav({ onNavItemClick }: BottomNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: "home" as NavItem,
      icon: <Home className="h-5 w-5" />,
      label: "Home",
      href: "/",
    },
    {
      name: "timetable" as NavItem,
      icon: <Calendar className="h-5 w-5" />,
      label: "Timetable",
      href: "/timetable",
    },
    {
      name: "notices" as NavItem,
      icon: <Bell className="h-5 w-5" />,
      label: "Notices",
      href: "/notices",
    },
    {
      name: "bell-times" as NavItem,
      icon: <Clock className="h-5 w-5" />,
      label: "Bells",
      href: "/bell-times",
    },
    {
      name: "clipboard" as NavItem,
      icon: <Clipboard className="h-5 w-5" />,
      label: "Clipboard",
      href: "/clipboard",
    },
    {
      name: "awards" as NavItem,
      icon: <Award className="h-5 w-5" />,
      label: "Awards",
      href: "/awards",
    },
  ]

  const handleClick = (item: NavItem) => {
    if (onNavItemClick) {
      onNavItemClick(item)
    }
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-2 py-2 z-50 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90"
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ease-in-out ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => handleClick(item.name)}
            >
              <div className={`p-1 rounded-full ${isActive ? "bg-blue-100 dark:bg-blue-900/30" : ""}`}>
                {isActive ? (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                    {item.icon}
                  </motion.div>
                ) : (
                  item.icon
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
              {isActive && (
                <motion.div
                  className="absolute -bottom-2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                  layoutId="activeIndicator"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
