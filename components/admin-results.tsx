"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import UserDetailsModal from "./user-details-modal"
import { Loader2 } from "lucide-react"

type ExamResult = {
  _id: string
  userId: string
  userName: string
  userEmail: string
  totalQuestions: number
  correctAnswers: number
  score: number
  subjectScores: Record<string, number>
  date: string
  canRetake: boolean
}

export default function AdminResults() {
  const [results, setResults] = useState<ExamResult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("/api/results", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch results")
      }

      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load results",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUserId(null)
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Math</TableHead>
                <TableHead>Physics</TableHead>
                <TableHead>Chemistry</TableHead>
                <TableHead>Retake</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                results.map((result) => (
                  <TableRow key={result._id}>
                    <TableCell className="font-medium">{result.userName}</TableCell>
                    <TableCell>{result.userEmail}</TableCell>
                    <TableCell>{new Date(result.date).toLocaleDateString()}</TableCell>
                    <TableCell>{result.score}%</TableCell>
                    <TableCell>{result.subjectScores.math || 0}%</TableCell>
                    <TableCell>{result.subjectScores.physics || 0}%</TableCell>
                    <TableCell>{result.subjectScores.chemistry || 0}%</TableCell>
                    <TableCell>
                      {result.canRetake ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Allowed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewUser(result.userId)}>
                        View User
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedUserId && <UserDetailsModal userId={selectedUserId} isOpen={isModalOpen} onClose={handleCloseModal} />}
    </div>
  )
}
