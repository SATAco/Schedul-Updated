"use client"

import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import BottomNav from "@/components/bottom-nav"
import AnimatePresenceWrapper from "@/components/animate-presence-wrapper"
import { ThemeProvider, UserSettingsProvider } from "@/components/theme-provider"
import { TimetableProvider } from "@/contexts/timetable-context"

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Ensure theme is applied after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="schedul-theme-preference"
    >
      <UserSettingsProvider>
        <TimetableProvider>
          {mounted && (
            <>
              <AnimatePresenceWrapper>
                <div className="pb-20">{children}</div>
              </AnimatePresenceWrapper>
              <BottomNav />
            </>
          )}
        </TimetableProvider>
      </UserSettingsProvider>
    </ThemeProvider>
  )
}
