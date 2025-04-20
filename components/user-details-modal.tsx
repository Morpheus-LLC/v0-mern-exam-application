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
import { Loader2 } from "lucide-react"

interface UserDetailsModalProps {
  userId: string
  isOpen: boolean
  onClose: () => void
}

interface UserDetails {
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
  createdAt: string
  updatedAt: string
  hasTakenExam?: boolean
  canRetakeExam?: boolean
}

export default function UserDetailsModal({ userId, isOpen, onClose }: UserDetailsModalProps) {
  const [user, setUser] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [allowRetake, setAllowRetake] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails()
    }
  }, [isOpen, userId])

  const fetchUserDetails = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user details")
      }

      const data = await response.json()
      setUser(data.user)
      setAllowRetake(data.user.canRetakeExam || false)
    } catch (error) {
      console.error("Error fetching user details:", error)
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAllowRetake = async () => {
    setUpdating(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`/api/admin/users/${userId}/allow-retake`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ canRetake: !allowRetake }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      setAllowRetake(!allowRetake)
      toast({
        title: "Success",
        description: !allowRetake
          ? "User is now allowed to retake the exam"
          : "User is no longer allowed to retake the exam",
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Detailed information about the user</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : user ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p>{user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="capitalize">{user.role}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Exam Status</p>
                <p>{user.hasTakenExam ? "Completed" : "Not taken"}</p>
              </div>
            </div>

            {user.hasTakenExam && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Exam Access Control</h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {allowRetake
                      ? "This user is currently allowed to retake the exam"
                      : "This user cannot retake the exam"}
                  </p>
                  <Button
                    variant={allowRetake ? "destructive" : "default"}
                    size="sm"
                    onClick={handleAllowRetake}
                    disabled={updating}
                  >
                    {updating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : allowRetake ? (
                      "Revoke Retake Permission"
                    ) : (
                      "Allow Exam Retake"
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p>{user.phoneNumber || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Alternate Phone</p>
                  <p>{user.alternatePhoneNumber || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="capitalize">{user.gender || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p>{user.age || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">District</p>
                  <p className="capitalize">{user.district || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Ration Card</p>
                  <p className="capitalize">{user.rationCard || "None"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Ration Card Number</p>
                  <p>{user.rationCardNumber || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">Educational Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">College Name</p>
                  <p>{user.collegeName || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Roll Number</p>
                  <p>{user.rollNumber || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Intermediate Hall Ticket</p>
                  <p>{user.intermediateHallTicket || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">EAMCET Hall Ticket</p>
                  <p>{user.eamcetHallTicket || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Home Address</p>
                  <p className="whitespace-pre-wrap">{user.homeAddress || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">College Address</p>
                  <p className="whitespace-pre-wrap">{user.collegeAddress || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p>{new Date(user.createdAt).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p>{new Date(user.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">User not found</div>
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
