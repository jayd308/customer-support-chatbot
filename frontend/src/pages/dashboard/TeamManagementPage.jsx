import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import axiosInstance from '../../api/axios'
import toast from 'react-hot-toast'

const TeamManagementPage = () => {
  const [loading, setLoading] = useState(true)
  const [teamMembers, setTeamMembers] = useState([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    role: 'member'
  })
  const [inviteErrors, setInviteErrors] = useState({})
  const [sendingInvite, setSendingInvite] = useState(false)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await axiosInstance.get('/business/team')
      setTeamMembers(response.data)
    } catch (error) {
      toast.error('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    
    // Validate
    const errors = {}
    if (!inviteData.name) errors.name = 'Name is required'
    if (!inviteData.email) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(inviteData.email)) errors.email = 'Email is invalid'
    
    if (Object.keys(errors).length > 0) {
      setInviteErrors(errors)
      return
    }

    setSendingInvite(true)
    try {
      await axiosInstance.post('/business/team', inviteData)
      toast.success(`Invitation sent to ${inviteData.email}`)
      setShowInviteModal(false)
      setInviteData({ name: '', email: '', role: 'member' })
      fetchTeamMembers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send invitation')
    } finally {
      setSendingInvite(false)
    }
  }

  const handleRemoveMember = async (userId, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the team?`)) {
      try {
        await axiosInstance.delete(`/business/team/${userId}`)
        toast.success(`${name} removed from team`)
        fetchTeamMembers()
      } catch (error) {
        toast.error('Failed to remove team member')
      }
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosInstance.put(`/business/team/${userId}/role`, { role: newRole })
      toast.success('Role updated successfully')
      fetchTeamMembers()
    } catch (error) {
      toast.error('Failed to update role')
    }
  }

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
      case 'manager': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Team Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Invite team members and manage their permissions
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowInviteModal(true)}
            className="mt-4 md:mt-0"
          >
            + Invite Team Member
          </Button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Total Members</span>
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {teamMembers.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Admins</span>
              <span className="text-2xl">👑</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {teamMembers.filter(m => m.role === 'admin').length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Pending Invites</span>
              <span className="text-2xl">⏳</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {teamMembers.filter(m => m.status === 'pending').length}
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {teamMembers.map((member, index) => (
                  <motion.tr
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                          {member.name?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(member.role)} border-0 focus:ring-2 focus:ring-primary`}
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="member">Member</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {member.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {member.lastLogin 
                        ? new Date(member.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemoveMember(member._id, member.name)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remove member"
                      >
                        🗑️
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {teamMembers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
              <p className="text-gray-500 mb-6">
                Invite your first team member to collaborate
              </p>
              <Button variant="primary" onClick={() => setShowInviteModal(true)}>
                Invite Team Member
              </Button>
            </div>
          )}
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold">Invite Team Member</h2>
              </div>

              <form onSubmit={handleInvite} className="p-6 space-y-6">
                <Input
                  label="Full Name"
                  value={inviteData.name}
                  onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                  error={inviteErrors.name}
                  placeholder="Enter member's name"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                  error={inviteErrors.email}
                  placeholder="Enter member's email"
                  required
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={inviteData.role}
                    onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                  >
                    <option value="member">Member - Can view and respond</option>
                    <option value="manager">Manager - Can manage FAQs and settings</option>
                    <option value="admin">Admin - Full access</option>
                  </select>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    📧 An invitation email will be sent to this address with instructions to join your team.
                  </p>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={sendingInvite}
                  >
                    Send Invitation
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TeamManagementPage