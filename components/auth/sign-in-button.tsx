"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/api/hooks"
import { School, ExternalLink, Wifi, WifiOff } from "lucide-react"

interface SignInButtonProps {
  onSuccess?: () => void
}

export default function SignInButton({ onSuccess }: SignInButtonProps) {
  const { initiateLogin, loading } = useAuth()
  const [portalStatus, setPortalStatus] = useState<"checking" | "online" | "offline">("checking")

  useEffect(() => {
    // Check if SBHS portal is reachable
    const checkPortalStatus = async () => {
      try {
        const response = await fetch("https://student.sbhs.net.au", {
          method: "HEAD",
          mode: "no-cors",
          cache: "no-cache",
        })
        setPortalStatus("online")
      } catch (error) {
        setPortalStatus("offline")
      }
    }

    checkPortalStatus()
  }, [])

  const handleSignIn = async () => {
    await initiateLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md rounded-[1.5rem] shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-theme-secondary rounded-full flex items-center justify-center mb-4">
              <School className="h-8 w-8 text-theme-primary" />
            </div>
            <h1 className="text-2xl font-bold theme-gradient">Schedul</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Connect with your SBHS Student Portal account
            </p>
          </div>

          {/* Portal Status Indicator */}
          <div className="mb-6">
            <div
              className={`flex items-center gap-2 text-sm px-3 py-2 rounded-full ${
                portalStatus === "online"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                  : portalStatus === "offline"
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              {portalStatus === "checking" && (
                <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent" />
              )}
              {portalStatus === "online" && <Wifi className="h-3 w-3" />}
              {portalStatus === "offline" && <WifiOff className="h-3 w-3" />}
              <span>
                {portalStatus === "checking" && "Checking portal connection..."}
                {portalStatus === "online" && "SBHS Portal is online"}
                {portalStatus === "offline" && "Portal may be offline"}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full p-1 bg-blue-100 dark:bg-blue-900/30">
                  <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Secure Authentication</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You'll be redirected to the official SBHS Student Portal to sign in securely with your existing
                    credentials.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSignIn}
              className="w-full rounded-xl bg-theme-primary hover:opacity-90 h-12 text-base font-medium"
              disabled={loading || portalStatus === "offline"}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Redirecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Sign in with SBHS Portal
                </div>
              )}
            </Button>

            {portalStatus === "offline" && (
              <div className="text-center">
                <p className="text-sm text-red-600 dark:text-red-400">
                  The SBHS portal appears to be offline. Please try again later.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div className="text-center">
              <a
                href="https://student.sbhs.net.au"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-theme-primary hover:opacity-80 transition-opacity"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Visit SBHS Student Portal
              </a>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Having trouble? Contact the school IT department for assistance.
              </p>
            </div>

            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing in, you agree to use your SBHS credentials responsibly and in accordance with school
                policies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
