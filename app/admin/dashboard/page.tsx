"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import AdminQuestions from "@/components/admin-questions"
import AdminResults from "@/components/admin-results"

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
