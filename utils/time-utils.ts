// Get current time in 12-hour format (HH:MM AM/PM)
export const getCurrentTime = (): string => {
  const now = new Date()
  return formatTo12Hour(now)
}

// Format time to 12-hour format
export const formatTo12Hour = (date: Date): string => {
  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`
}

// Parse time string (e.g., "8:45 - 9:45") to get start and end times
export const parseTimeRange = (timeRange: string): { start: Date; end: Date } => {
  const [startStr, endStr] = timeRange.split(" - ")

  const now = new Date()
  const startParts = startStr.split(":")
  const endParts = endStr.split(":")

  const startDate = new Date()
  startDate.setHours(Number.parseInt(startParts[0], 10))
  startDate.setMinutes(Number.parseInt(startParts[1], 10))
  startDate.setSeconds(0)

  const endDate = new Date()
  endDate.setHours(Number.parseInt(endParts[0], 10))
  endDate.setMinutes(Number.parseInt(endParts[1], 10))
  endDate.setSeconds(0)

  return { start: startDate, end: endDate }
}

// Calculate time until next period
export const getTimeUntilNextPeriod = (
  currentPeriods: Array<{ period: string; time: string; subject: string; teacher: string; room: string }>,
): {
  nextPeriod: { period: string; time: string; subject: string; teacher: string; room: string } | null
  timeUntil: string
  isCurrentlyInClass: boolean
  currentPeriod: { period: string; time: string; subject: string; teacher: string; room: string } | null
} => {
  const now = new Date()

  // Find current period
  let currentPeriod = null
  for (const period of currentPeriods) {
    const { start, end } = parseTimeRange(period.time)
    if (now >= start && now <= end) {
      currentPeriod = period
      break
    }
  }

  // Find next period
  let nextPeriod = null
  let timeUntil = ""
  let isCurrentlyInClass = false

  if (currentPeriod) {
    // Currently in a period
    isCurrentlyInClass = true
    const { end } = parseTimeRange(currentPeriod.time)
    const diffMs = end.getTime() - now.getTime()

    // Find the next period after current
    const currentIndex = currentPeriods.findIndex((p) => p.period === currentPeriod?.period)
    if (currentIndex < currentPeriods.length - 1) {
      nextPeriod = currentPeriods[currentIndex + 1]
    }

    // Format time remaining in current period
    const diffMinutes = Math.floor(diffMs / 60000)
    timeUntil = `${diffMinutes} min until end`
  } else {
    // Not currently in a period, find the next one
    for (const period of currentPeriods) {
      const { start } = parseTimeRange(period.time)
      if (now < start) {
        nextPeriod = period

        const diffMs = start.getTime() - now.getTime()
        const diffMinutes = Math.floor(diffMs / 60000)

        if (diffMinutes < 60) {
          timeUntil = `${diffMinutes} min until start`
        } else {
          const hours = Math.floor(diffMinutes / 60)
          const mins = diffMinutes % 60
          timeUntil = `${hours}h ${mins}m until start`
        }

        break
      }
    }
  }

  // If no next period found (end of day)
  if (!nextPeriod && !isCurrentlyInClass) {
    timeUntil = "No more classes today"
  }

  return { nextPeriod, timeUntil, isCurrentlyInClass, currentPeriod }
}

// Get day of week
export const getCurrentDay = (): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[new Date().getDay()]
}

// Format date as "Month Day, Year"
export const formatDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

// Check if current time is within school hours
export const isWithinSchoolHours = (): boolean => {
  const now = new Date()
  const day = now.getDay() // 0 is Sunday, 6 is Saturday

  // Return false for weekends
  if (day === 0 || day === 6) return false

  const hours = now.getHours()
  // School hours: 8:00 AM to 4:00 PM (8 to 16)
  return hours >= 8 && hours < 16
}
