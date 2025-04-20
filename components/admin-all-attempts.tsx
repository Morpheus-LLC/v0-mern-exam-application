"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import AdminAttemptDetails from "./admin-attempt-details"

type AttemptSummary = {
  id: string
  userId: {
    _id: string
    name: string
    email: string
  }
  startTime: string
  endTime: string
  hasSubmitted: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  questionsCount: number
  answeredCount: number
}

export default function AdminAllAttempts() {
  const [attempts, setAttempts] = useState<AttemptSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [attemptDetailsOpen, setAttemptDetailsOpen] = useState(false)
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null)

  useEffect(() => {
    fetchAttempts()
  }, [])

  const fetchAttempts = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("/api/admin/attempts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch attempts")
      }

      const data = await response.json()
      setAttempts(data.attempts)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attempts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const handleViewAttemptDetails = (attemptId: string) => {
    setSelectedAttemptId(attemptId)
    setAttemptDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">All Exam Attempts</h2>
        <Button variant="outline" onClick={fetchAttempts} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
        </div>
      ) : attempts.length === 0 ? (
        <div className="py-8 text-center">No exam attempts found</div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell>
                    <div className="font-medium">{attempt.userId.name}</div>
                    <div className="text-xs text-gray-500">{attempt.userId.email}</div>
                  </TableCell>
                  <TableCell>
                    <div>{formatDate(attempt.startTime)}</div>
                    <div className="text-xs text-gray-500">{getTimeAgo(attempt.startTime)}</div>
                  </TableCell>
                  <TableCell>
                    {attempt.isActive ? (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Active
                      </Badge>
                    ) : attempt.hasSubmitted ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Submitted
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Abandoned
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${Math.round((attempt.answeredCount / attempt.questionsCount) * 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">
                        {attempt.answeredCount}/{attempt.questionsCount}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => handleViewAttemptDetails(attempt.id)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AdminAttemptDetails
        attemptId={selectedAttemptId}
        isOpen={attemptDetailsOpen}
        onClose={() => setAttemptDetailsOpen(false)}
      />
    </div>
  )
}
