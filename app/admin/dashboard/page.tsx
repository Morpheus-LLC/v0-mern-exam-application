"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import AdminQuestions from "@/components/admin-questions"
import AdminResults from "@/components/admin-results"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingTestData, setLoadingTestData] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/admin")
      return
    }

    // Check if admin
    try {
      const tokenParts = token.split(".")
      const payload = JSON.parse(atob(tokenParts[1]))

      if (payload.role !== "admin") {
        toast({
          title: "Access denied",
          description: "You do not have admin privileges.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }
    } catch (error) {
      localStorage.removeItem("token")
      router.push("/admin")
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

  const handleLoadTestData = async (clearExisting: boolean) => {
    setLoadingTestData(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("/api/admin/load-test-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clearExisting }),
      })

      if (!response.ok) {
        throw new Error("Failed to load test data")
      }

      const data = await response.json()

      toast({
        title: "Test data loaded",
        description: `Successfully loaded ${data.result.users} users, ${data.result.questions} questions, and ${data.result.results} exam results.`,
      })

      // Refresh the page to show new data
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load test data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingTestData(false)
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
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={loadingTestData}>
                {loadingTestData ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load Test Data"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Load Test Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This will load sample test data into the database. Would you like to clear existing data first?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleLoadTestData(false)}>Keep Existing Data</AlertDialogAction>
                <AlertDialogAction onClick={() => handleLoadTestData(true)} className="bg-red-500 hover:bg-red-600">
                  Clear & Replace
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questions">Manage Questions</TabsTrigger>
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
