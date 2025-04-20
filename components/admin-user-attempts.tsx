"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"

type UserAttemptsProps = {
  userId: string | null
  isOpen: boolean
  onClose: () => void
  onViewAttempt: (attemptId: string) => void
}

type AttemptSummary = {
  id: string
  startTime: string
  endTime: string
  hasSubmitted: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  questionsCount: number
  answeredCount: number
}

export default function AdminUserAttempts({ userId, isOpen, onClose, onViewAttempt }: UserAttemptsProps) {
  const [attempts, setAttempts] = useState<AttemptSummary[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && userId) {
      fetchAttempts()
    }
  }, [isOpen, userId])

  const fetchAttempts = async () => {
    if (!userId) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/users/${userId}/attempts`, {
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
        description: "Failed to load user attempts",
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

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exam Attempts</DialogTitle>
          <DialogDescription>View all exam attempts for this user</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
          </div>
        ) : attempts.length === 0 ? (
          <div className="py-8 text-center">No exam attempts found for this user</div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell>
                      <div className="font-medium">{formatDate(attempt.startTime)}</div>
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
                    <TableCell>
                      {(() => {
                        const start = new Date(attempt.startTime)
                        const end = attempt.hasSubmitted
                          ? new Date(attempt.updatedAt)
                          : attempt.isActive
                            ? new Date()
                            : new Date(attempt.endTime)
                        const durationMs = end.getTime() - start.getTime()
                        const minutes = Math.floor(durationMs / 60000)
                        const seconds = Math.floor((durationMs % 60000) / 1000)
                        return `${minutes}m ${seconds}s`
                      })()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => onViewAttempt(attempt.id)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
