"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import AdminQuestions from "@/components/admin-questions"
import AdminResults from "@/components/admin-results"
import AdminUsers from "@/components/admin-users"
import { AlertCircle, Loader2 } from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingTestData, setLoadingTestData] = useState(false)
  const [questionCounts, setQuestionCounts] = useState<{
    math: number
    physics: number
    chemistry: number
    total: number
  } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/admin")
      return
    }

    // Check if admin
    const tokenParts = token.split("-")
    const role = tokenParts[4]

    if (role !== "admin") {
      toast({
        title: "Access denied",
        description: "You do not have admin privileges.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        localStorage.removeItem("token")
        router.push("/admin")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
    checkQuestions()
  }, [router])

  const checkQuestions = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("/api/admin/check-questions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to check questions")
      }

      const data = await response.json()
      setQuestionCounts(data.counts)
    } catch (error) {
      console.error("Error checking questions:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/admin")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const handleLoadTestData = async () => {
    setLoadingTestData(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("/api/admin/load-test-data", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to load test data")
      }

      const data = await response.json()

      toast({
        title: "Test data loaded successfully",
        description: `Loaded ${data.counts.users} users, ${data.counts.questions} questions, and ${data.counts.results} results.`,
      })

      // Refresh question counts
      checkQuestions()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load test data",
        variant: "destructive",
      })
    } finally {
      setLoadingTestData(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
            Admin Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Load Test Data</h3>
                <p className="text-sm text-gray-500">
                  Populate the database with sample users, questions, and exam results
                </p>
              </div>
              <Button onClick={handleLoadTestData} variant="outline" disabled={loadingTestData}>
                {loadingTestData ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Load Test Data"
                )}
              </Button>
            </div>

            {questionCounts && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Question Database Status</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    Mathematics: <span className="font-medium">{questionCounts.math}</span>
                  </div>
                  <div>
                    Physics: <span className="font-medium">{questionCounts.physics}</span>
                  </div>
                  <div>
                    Chemistry: <span className="font-medium">{questionCounts.chemistry}</span>
                  </div>
                  <div>
                    Total: <span className="font-medium">{questionCounts.total}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questions">Manage Questions</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="results">View Results</TabsTrigger>
        </TabsList>
        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Question Management</CardTitle>
              <CardDescription>Add, edit, or remove questions from the exam database</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminQuestions />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminUsers />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Exam Results</CardTitle>
              <CardDescription>View all student exam results</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminResults />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
