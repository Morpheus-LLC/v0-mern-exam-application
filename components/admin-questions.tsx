"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Question = {
  id: string
  text: string
  options: string[]
  correctOption: string
  subject: "math" | "science" | "chemistry" | "english"
}

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState<string>("math")
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctOption: "",
    subject: "math" as "math" | "science" | "chemistry" | "english",
  })
  const [csvData, setCsvData] = useState("")
  const [csvSubject, setCsvSubject] = useState<"math" | "science" | "chemistry" | "english">("math")

  useEffect(() => {
    fetchQuestions()
  }, [subject])

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`/api/questions?subject=${subject}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch questions")
      }

      const data = await response.json()
      setQuestions(data.questions)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      // Validate form
      if (!newQuestion.text || newQuestion.options.some((opt) => !opt) || !newQuestion.correctOption) {
        toast({
          title: "Validation Error",
          description: "Please fill in all fields",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newQuestion),
      })

      if (!response.ok) {
        throw new Error("Failed to add question")
      }

      toast({
        title: "Success",
        description: "Question added successfully",
      })

      // Reset form
      setNewQuestion({
        text: "",
        options: ["", "", "", ""],
        correctOption: "",
        subject: newQuestion.subject,
      })

      // Refresh questions
      fetchQuestions()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add question",
        variant: "destructive",
      })
    }
  }

  const handleDeleteQuestion = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete question")
      }

      toast({
        title: "Success",
        description: "Question deleted successfully",
      })

      // Refresh questions
      fetchQuestions()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      })
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options]
    newOptions[index] = value
    setNewQuestion({ ...newQuestion, options: newOptions })
  }

  const handleUploadCSV = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      if (!csvData) {
        toast({
          title: "Validation Error",
          description: "Please enter CSV data",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/questions/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          csvData,
          subject: csvSubject,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to upload questions")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: `${data.count} questions uploaded successfully`,
      })

      // Reset form
      setCsvData("")

      // Refresh questions
      fetchQuestions()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload questions",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="view">View Questions</TabsTrigger>
          <TabsTrigger value="add">Add Question</TabsTrigger>
          <TabsTrigger value="upload">Upload CSV</TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="filter-subject">Filter by Subject:</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="math">Math</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <p>Loading questions...</p>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Question</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Correct Answer</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No questions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    questions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium">{question.text}</TableCell>
                        <TableCell>{question.options.join(", ")}</TableCell>
                        <TableCell>{question.correctOption}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="add">
          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={newQuestion.subject}
                onValueChange={(value: "math" | "science" | "chemistry" | "english") =>
                  setNewQuestion({ ...newQuestion, subject: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Math</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-text">Question</Label>
              <Textarea
                id="question-text"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                placeholder="Enter question text"
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Options</Label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewQuestion({ ...newQuestion, correctOption: option })}
                    className={newQuestion.correctOption === option ? "bg-green-100" : ""}
                  >
                    {newQuestion.correctOption === option ? "Correct ✓" : "Set as Correct"}
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit">Add Question</Button>
          </form>
        </TabsContent>

        <TabsContent value="upload">
          <form onSubmit={handleUploadCSV} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-subject">Subject for All Questions</Label>
              <Select
                value={csvSubject}
                onValueChange={(value: "math" | "science" | "chemistry" | "english") => setCsvSubject(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Math</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="csv-data">CSV Data</Label>
              <Textarea
                id="csv-data"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="question,option1,option2,option3,option4,correctOption"
                className="min-h-[200px]"
                required
              />
              <p className="text-sm text-gray-500">
                Format: question,option1,option2,option3,option4,correctOption
                <br />
                One question per line
              </p>
            </div>

            <Button type="submit">Upload Questions</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
