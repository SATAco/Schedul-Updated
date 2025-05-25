import type { NavItem } from "@/components/bottom-nav"

// Get the most used section from localStorage
export const getMostUsedSection = (): NavItem => {
  if (typeof window === "undefined") return "timetable"

  const usageData = localStorage.getItem("usageData")
  if (!usageData) return "timetable"

  try {
    const parsed = JSON.parse(usageData) as Record<NavItem, number>
    let mostUsed: NavItem = "timetable"
    let highestCount = 0

    Object.entries(parsed).forEach(([key, count]) => {
      if (count > highestCount) {
        highestCount = count
        mostUsed = key as NavItem
      }
    })

    return mostUsed
  } catch (error) {
    return "timetable"
  }
}

// Track usage of a section
export const trackSectionUsage = (section: NavItem): void => {
  if (typeof window === "undefined") return

  const usageData = localStorage.getItem("usageData")
  let parsed: Record<NavItem, number> = {
    home: 0,
    timetable: 0,
    notices: 0,
    "bell-times": 0,
    clipboard: 0,
    awards: 0,
  }

  if (usageData) {
    try {
      parsed = JSON.parse(usageData) as Record<NavItem, number>
    } catch (error) {
      // Use default if parsing fails
    }
  }

  // Increment the count for this section
  parsed[section] = (parsed[section] || 0) + 1

  // Save back to localStorage
  localStorage.setItem("usageData", JSON.stringify(parsed))
}
