"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

type ExamResult = {
  id: string
  userId: string
  userName: string
  userEmail: string
  totalQuestions: number
  correctAnswers: number
  score: number
  subjectScores: Record<string, number>
  date: string
}

export default function AdminResults() {
  const [results, setResults] = useState<ExamResult[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div>
      {loading ? (
        <p>Loading results...</p>
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
                <TableHead>Science</TableHead>
                <TableHead>Chemistry</TableHead>
                <TableHead>English</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.userName}</TableCell>
                    <TableCell>{result.userEmail}</TableCell>
                    <TableCell>{new Date(result.date).toLocaleDateString()}</TableCell>
                    <TableCell>{result.score}%</TableCell>
                    <TableCell>{result.subjectScores.math || 0}%</TableCell>
                    <TableCell>{result.subjectScores.science || 0}%</TableCell>
                    <TableCell>{result.subjectScores.chemistry || 0}%</TableCell>
                    <TableCell>{result.subjectScores.english || 0}%</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
