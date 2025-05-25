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
    const colors = getThemeColors(theme)
    const root = document.documentElement

    root.style.setProperty("--theme-primary", colors.primary)
    root.style.setProperty("--theme-primary-dark", colors.primaryDark)
    root.style.setProperty("--theme-secondary", colors.secondary)
    root.style.setProperty("--theme-secondary-dark", colors.secondaryDark)
    root.style.setProperty("--theme-accent", colors.accent)
    root.style.setProperty("--theme-accent-dark", colors.accentDark)
  }

  // Apply initial color theme
  useEffect(() => {
    const colors = getThemeColors(colorTheme)
    const root = document.documentElement

    root.style.setProperty("--theme-primary", colors.primary)
    root.style.setProperty("--theme-primary-dark", colors.primaryDark)
    root.style.setProperty("--theme-secondary", colors.secondary)
    root.style.setProperty("--theme-secondary-dark", colors.secondaryDark)
    root.style.setProperty("--theme-accent", colors.accent)
    root.style.setProperty("--theme-accent-dark", colors.accentDark)
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
function getThemeColors(theme: ColorTheme) {
  const colorMap = {
    blue: {
      primary: "217 91% 60%",
      primaryDark: "217 91% 50%",
      secondary: "217 91% 95%",
      secondaryDark: "217 91% 15%",
      accent: "217 91% 85%",
      accentDark: "217 91% 25%",
    },
    purple: {
      primary: "262 83% 58%",
      primaryDark: "262 83% 48%",
      secondary: "262 83% 95%",
      secondaryDark: "262 83% 15%",
      accent: "262 83% 85%",
      accentDark: "262 83% 25%",
    },
    green: {
      primary: "142 76% 36%",
      primaryDark: "142 76% 26%",
      secondary: "142 76% 95%",
      secondaryDark: "142 76% 15%",
      accent: "142 76% 85%",
      accentDark: "142 76% 25%",
    },
    red: {
      primary: "0 84% 60%",
      primaryDark: "0 84% 50%",
      secondary: "0 84% 95%",
      secondaryDark: "0 84% 15%",
      accent: "0 84% 85%",
      accentDark: "0 84% 25%",
    },
    orange: {
      primary: "25 95% 53%",
      primaryDark: "25 95% 43%",
      secondary: "25 95% 95%",
      secondaryDark: "25 95% 15%",
      accent: "25 95% 85%",
      accentDark: "25 95% 25%",
    },
  }

  return colorMap[theme]
}
