"use client"

import { useState, useEffect } from "react"
import { Settings, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar, Bell, Clock, Clipboard, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUserSettings, type ColorTheme } from "@/components/theme-provider"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [preferredSection, setPreferredSection] = useState<string>("auto")
  const [activeTab, setActiveTab] = useState<"general" | "appearance" | "feedback">("general")
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const router = useRouter()
  const { preferredMostUsed, setPreferredMostUsed, colorTheme, setColorTheme } = useUserSettings()

  // Load saved preference on mount
  useEffect(() => {
    setPreferredSection(preferredMostUsed)
  }, [preferredMostUsed])

  // Save preference when changed
  const handleSectionChange = (section: string) => {
    setPreferredSection(section)
    setPreferredMostUsed(section)

    // Force a refresh to update all components
    router.refresh()
  }

  const handleColorThemeChange = (theme: ColorTheme) => {
    setColorTheme(theme)

    // Force a refresh to update all components
    router.refresh()
  }

  const handleFeedbackSubmit = () => {
    // In a real app, this would send the feedback to a server
    console.log("Feedback submitted:", feedbackText)
    setFeedbackSubmitted(true)
    setFeedbackText("")

    // Reset after 3 seconds
    setTimeout(() => {
      setFeedbackSubmitted(false)
    }, 3000)
  }

  const sections = [
    { id: "auto", label: "Automatic (based on usage)" },
    { id: "timetable", label: "Timetable", icon: <Calendar className="h-4 w-4" /> },
    { id: "notices", label: "Daily Notices", icon: <Bell className="h-4 w-4" /> },
    { id: "bell-times", label: "Bells", icon: <Clock className="h-4 w-4" /> },
    { id: "clipboard", label: "Clipboard", icon: <Clipboard className="h-4 w-4" /> },
    { id: "awards", label: "Award Points", icon: <Award className="h-4 w-4" /> },
  ]

  const colorThemes = [
    { id: "blue" as ColorTheme, label: "Blue", color: "bg-blue-600" },
    { id: "purple" as ColorTheme, label: "Purple", color: "bg-purple-600" },
    { id: "green" as ColorTheme, label: "Green", color: "bg-green-600" },
    { id: "red" as ColorTheme, label: "Red", color: "bg-red-600" },
    { id: "orange" as ColorTheme, label: "Orange", color: "bg-orange-600" },
  ]

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-[1.5rem] p-5 w-full max-w-md shadow-lg max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setIsOpen(false)}>
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>

            <div className="flex mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
              <button
                className={`flex-1 py-2 text-sm rounded-full transition-all ${
                  activeTab === "general" ? "bg-white dark:bg-gray-900 shadow-sm" : ""
                }`}
                onClick={() => setActiveTab("general")}
              >
                General
              </button>
              <button
                className={`flex-1 py-2 text-sm rounded-full transition-all ${
                  activeTab === "appearance" ? "bg-white dark:bg-gray-900 shadow-sm" : ""
                }`}
                onClick={() => setActiveTab("appearance")}
              >
                Appearance
              </button>
              <button
                className={`flex-1 py-2 text-sm rounded-full transition-all ${
                  activeTab === "feedback" ? "bg-white dark:bg-gray-900 shadow-sm" : ""
                }`}
                onClick={() => setActiveTab("feedback")}
              >
                Feedback
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 -mr-1">
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Most Used Section</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Choose which section appears in the "Most Used" card
                    </p>

                    <div className="space-y-2">
                      {sections.map((section) => (
                        <div
                          key={section.id}
                          className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                            preferredSection === section.id
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                          onClick={() => handleSectionChange(section.id)}
                        >
                          {section.icon && <div className="mr-3">{section.icon}</div>}
                          <span className="font-medium">{section.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Color Theme</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Choose the accent color for the app</p>

                    <div className="grid grid-cols-5 gap-2">
                      {colorThemes.map((theme) => (
                        <div
                          key={theme.id}
                          className={`flex flex-col items-center cursor-pointer p-2 rounded-lg ${
                            colorTheme === theme.id ? "bg-gray-100 dark:bg-gray-800" : ""
                          }`}
                          onClick={() => handleColorThemeChange(theme.id)}
                        >
                          <div
                            className={`w-8 h-8 rounded-full ${theme.color} mb-1 ${
                              colorTheme === theme.id ? "ring-2 ring-offset-2 ring-gray-400" : ""
                            }`}
                          ></div>
                          <span className="text-xs">{theme.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "feedback" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Send Feedback</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Let us know how we can improve the app
                    </p>

                    <Textarea
                      placeholder="Type your feedback here..."
                      className="min-h-[120px] mb-3"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />

                    <Button
                      className="w-full"
                      onClick={handleFeedbackSubmit}
                      disabled={!feedbackText.trim() || feedbackSubmitted}
                    >
                      {feedbackSubmitted ? (
                        "Thank you!"
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Feedback
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
