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

type UserDetailsProps = {
  userId: string | null
  isOpen: boolean
  onClose: () => void
}

type UserDetails = {
  _id: string
  name: string
  email: string
  role: string
  collegeName?: string
  rollNumber?: string
  phoneNumber?: string
  alternatePhoneNumber?: string
  intermediateHallTicket?: string
  eamcetHallTicket?: string
  gender?: string
  age?: string
  district?: string
  collegeAddress?: string
  homeAddress?: string
  rationCard?: string
  rationCardNumber?: string
  examAttempts?: number
  examAllowed?: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminUserDetailsModal({ userId, isOpen, onClose }: UserDetailsProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [allowExam, setAllowExam] = useState(false)

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails()
    }
  }, [isOpen, userId])

  const fetchUserDetails = async () => {
    if (!userId) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user details")
      }

      const data = await response.json()
      setUserDetails(data.user)
      setAllowExam(data.user.examAllowed !== false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleExamPermission = async () => {
    if (!userId) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/users/${userId}/toggle-exam`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examAllowed: !allowExam,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      setAllowExam(!allowExam)
      toast({
        title: "Success",
        description: `User ${!allowExam ? "can now take" : "can no longer take"} the exam`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Detailed information about the selected user</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
          </div>
        ) : userDetails ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{userDetails.name}</h3>
                <p className="text-gray-500">{userDetails.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={userDetails.role === "admin" ? "destructive" : "default"}>
                  {userDetails.role || "user"}
                </Badge>
                <Badge variant={userDetails.examAllowed !== false ? "outline" : "secondary"}>
                  {userDetails.examAllowed !== false ? "Can Take Exam" : "Exam Restricted"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Personal Information</h4>
                  <dl className="divide-y divide-gray-100">
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">Gender</dt>
                      <dd className="text-sm col-span-2">{userDetails.gender || "-"}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">Age</dt>
                      <dd className="text-sm col-span-2">{userDetails.age || "-"}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">District</dt>
                      <dd className="text-sm col-span-2">{userDetails.district || "-"}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">Phone</dt>
                      <dd className="text-sm col-span-2">{userDetails.phoneNumber || "-"}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">Alt Phone</dt>
                      <dd className="text-sm col-span-2">{userDetails.alternatePhoneNumber || "-"}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">Ration Card</dt>
                      <dd className="text-sm col-span-2">
                        {userDetails.rationCard !== "none" ? userDetails.rationCard : "None"}
                      </dd>
                    </div>
                    {userDetails.rationCard !== "none" && (
                      <div className="py-2 grid grid-cols-3">
                        <dt className="text-sm font-medium">Card Number</dt>
                        <dd className="text-sm col-span-2">{userDetails.rationCardNumber || "-"}</dd>
                      </div>
                    )}
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">Home Address</dt>
                      <dd className="text-sm col-span-2">{userDetails.homeAddress || "-"}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Educational Information</h4>
                  <dl className="divide-y divide-gray-100">
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">College</dt>
                      <dd className="text-sm col-span-2">{userDetails.collegeName || "-"}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">Roll Number</dt>
                      <dd className="text-sm col-span-2">{userDetails.rollNumber || "-"}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">Intermediate Hall Ticket</dt>
                      <dd className="text-sm col-span-2 truncate">{userDetails.intermediateHallTicket || "-"}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">EAMCET Hall Ticket</dt>
                      <dd className="text-sm col-span-2 truncate">{userDetails.eamcetHallTicket || "-"}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">College Address</dt>
                      <dd className="text-sm col-span-2">{userDetails.collegeAddress || "-"}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Exam Information</h4>
                  <dl className="divide-y divide-gray-100">
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">Attempts</dt>
                      <dd className="text-sm col-span-2">{userDetails.examAttempts || 0}</dd>
                    </div>
                    <div className="py-2 grid grid-cols-3">
                      <dt className="text-sm font-medium">Account Created</dt>
                      <dd className="text-sm col-span-2">{new Date(userDetails.createdAt).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">Exam Permission Control</h4>
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  {allowExam
                    ? "This user can currently take the exam."
                    : "This user is currently restricted from taking the exam."}
                </p>
                <Button variant={allowExam ? "destructive" : "default"} onClick={toggleExamPermission}>
                  {allowExam ? "Restrict Exam Access" : "Allow Exam Access"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">User not found</div>
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
