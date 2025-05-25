"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { trackSectionUsage } from "@/utils/usage-tracker"
import PageTransition from "@/components/page-transition"

export default function ClipboardPage() {
  useEffect(() => {
    // Track clipboard usage
    trackSectionUsage("clipboard")
  }, [])

  return (
    <PageTransition>
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-gray-500 dark:text-gray-400">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Clipboard</h1>
          <div className="w-6"></div> {/* Empty div for spacing */}
        </div>

        <div className="rounded-[1.5rem] overflow-hidden bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800">
          <iframe
            src="https://portal.clipboard.app/sbhs/calendar"
            className="w-full h-[calc(100vh-180px)] border-0"
            title="Clipboard Calendar"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: "100%", height: "800px" }}
          ></iframe>
        </div>
      </div>
    </PageTransition>
  )
}
