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
import AdminAllAttempts from "@/components/admin-all-attempts"
import { AlertCircle } from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)

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
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/admin")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const handleLoadTestData = async () => {
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load test data",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Load Test Data</h3>
              <p className="text-sm text-gray-500">
                Populate the database with sample users, questions, and exam results
              </p>
            </div>
            <Button onClick={handleLoadTestData} variant="outline">
              Load Test Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="questions">Manage Questions</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="results">View Results</TabsTrigger>
          <TabsTrigger value="attempts">Exam Attempts</TabsTrigger>
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
              <CardDescription>View and manage user accounts and exam permissions</CardDescription>
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
        <TabsContent value="attempts">
          <Card>
            <CardHeader>
              <CardTitle>Exam Attempts</CardTitle>
              <CardDescription>View all exam attempts with detailed question and answer analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminAllAttempts />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
