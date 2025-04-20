"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import AdminUserDetailsModal from "@/components/admin-user-details-modal"

type User = {
  _id: string
  name: string
  email: string
  collegeName?: string
  phoneNumber?: string
  examCount: number
  examAllowed?: boolean
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users)
      return
    }

    const lowerSearchTerm = searchTerm.toLowerCase()
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm) ||
        (user.collegeName && user.collegeName.toLowerCase().includes(lowerSearchTerm)) ||
        (user.phoneNumber && user.phoneNumber.toLowerCase().includes(lowerSearchTerm)),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data.users)
      setFilteredUsers(data.users)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (userId: string) => {
    setSelectedUserId(userId)
    setDetailsModalOpen(true)
  }

  const handleCloseModal = () => {
    setDetailsModalOpen(false)
    fetchUsers() // Refresh user list when modal is closed
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center border rounded-md px-3 py-2">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <Input
          placeholder="Search users by name, email, college..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {loading ? (
        <p className="text-center py-4">Loading users...</p>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.collegeName || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{user.examCount > 0 ? `Exam taken` : "No exam"}</Badge>
                        {user.examAllowed === false && <Badge variant="secondary">Restricted</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(user._id)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <AdminUserDetailsModal userId={selectedUserId} isOpen={detailsModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
