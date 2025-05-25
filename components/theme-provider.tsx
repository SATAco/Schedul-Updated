"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export type ColorTheme = "blue" | "purple" | "green" | "red" | "orange"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Create a context for user settings
type UserSettingsContextType = {
  preferredMostUsed: string
  setPreferredMostUsed: (section: string) => void
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined)

export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
  const [preferredMostUsed, setPreferredMostUsedState] = useState<string>("auto")
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("blue")

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem("schedul-most-used-preference")
    if (savedPreference) {
      setPreferredMostUsedState(savedPreference)
    }

    const savedColorTheme = localStorage.getItem("schedul-color-theme")
    if (savedColorTheme && ["blue", "purple", "green", "red", "orange"].includes(savedColorTheme)) {
      setColorThemeState(savedColorTheme as ColorTheme)
    }
  }, [])

  // Save settings to localStorage when changed
  const setPreferredMostUsed = (section: string) => {
    setPreferredMostUsedState(section)
    localStorage.setItem("schedul-most-used-preference", section)
  }

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme)
    localStorage.setItem("schedul-color-theme", theme)

    // Apply the color theme to CSS variables
    document.documentElement.style.setProperty("--theme-color-light", getThemeColor(theme, "light"))
    document.documentElement.style.setProperty("--theme-color-dark", getThemeColor(theme, "dark"))
  }

  // Apply initial color theme
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color-light", getThemeColor(colorTheme, "light"))
    document.documentElement.style.setProperty("--theme-color-dark", getThemeColor(colorTheme, "dark"))
  }, [colorTheme])

  return (
    <UserSettingsContext.Provider value={{ preferredMostUsed, setPreferredMostUsed, colorTheme, setColorTheme }}>
      {children}
    </UserSettingsContext.Provider>
  )
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext)
  if (context === undefined) {
    throw new Error("useUserSettings must be used within a UserSettingsProvider")
  }
  return context
}

// Helper function to get theme color values
function getThemeColor(theme: ColorTheme, mode: "light" | "dark"): string {
  const colors = {
    blue: {
      light: "from-blue-600 to-blue-800",
      dark: "from-blue-500 to-blue-700",
    },
    purple: {
      light: "from-purple-600 to-purple-800",
      dark: "from-purple-500 to-purple-700",
    },
    green: {
      light: "from-green-600 to-green-800",
      dark: "from-green-500 to-green-700",
    },
    red: {
      light: "from-red-600 to-red-800",
      dark: "from-red-500 to-red-700",
    },
    orange: {
      light: "from-orange-600 to-orange-800",
      dark: "from-orange-500 to-orange-700",
    },
  }

  return colors[theme][mode]
}
