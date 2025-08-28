'use client';

import type { User, CreateUserRequest, UpdateUserRequest } from '@/types/user';

import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import {
  PlusIcon,
  UsersIcon,
  UserCheckIcon,
  UserXIcon,
  ShieldIcon,
} from 'lucide-react';
import { useState } from 'react';

import { UsersModal } from './_components/UsersModal';
import UserTable from './_components/UserTable';

import { PageHeader } from '@/components/ui/page-header';
import { ConfirmationModal } from '@/components/modal/ConfirmationModal';
import { useUsers } from '@/hooks/useUsers';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const {
    users,
    stats,
    loading,
    error,
    addUser,
    editUser,
    removeUser,
    refreshUsers,
  } = useUsers();

  const handleCreateUser = async (data: CreateUserRequest) => {
    try {
      await addUser(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const handleEditUser = async (data: UpdateUserRequest) => {
    try {
      await editUser(data);
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await removeUser(userId);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleSubmit = async (data: CreateUserRequest | UpdateUserRequest) => {
    if (editingUser) {
      await handleEditUser(data as UpdateUserRequest);
    } else {
      await handleCreateUser(data as CreateUserRequest);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-indigo-600',
      description: 'All users',
      gradient: 'from-blue-50 to-indigo-50',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toString(),
      icon: UserCheckIcon,
      color: 'text-green-600',
      bgColor: 'from-green-500 to-emerald-600',
      description: 'Currently active',
      gradient: 'from-green-50 to-emerald-50',
    },
    {
      title: 'Inactive Users',
      value: stats.inactiveUsers.toString(),
      icon: UserXIcon,
      color: 'text-orange-600',
      bgColor: 'from-orange-500 to-amber-600',
      description: 'Inactive accounts',
      gradient: 'from-orange-50 to-amber-50',
    },
    {
      title: 'Total Roles',
      value: stats.totalRoles.toString(),
      icon: ShieldIcon,
      color: 'text-purple-600',
      bgColor: 'from-purple-500 to-violet-600',
      description: 'User roles',
      gradient: 'from-purple-50 to-violet-50',
    },
  ];

  return (
    <>
      <PageHeader
        description="Manage users, roles, and permissions across the system"
        icon={<UsersIcon />}
      />

      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-default-600 mt-1">
              Manage users, roles, and permissions across the system
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full sm:w-auto font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
              color="primary"
              startContent={<PlusIcon className="w-4 h-4" />}
              variant="shadow"
              onPress={() => setIsModalOpen(true)}
            >
              Create User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 overflow-hidden group"
            >
              <CardBody className="p-6 relative">
                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium text-default-500 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-default-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-default-400 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Users Table */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="pb-6">
            <div className="w-full">
              <h3 className="text-xl font-bold text-default-900">User List</h3>
              <p className="text-sm text-default-600">
                View and manage all system users
              </p>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-default-400">Loading users...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-red-500">Error: {error}</div>
              </div>
            ) : (
              <UserTable
                users={users}
                onDelete={(userId: string) => {
                  const user = users.find(u => u.id === userId);

                  if (user) {
                    handleDelete(user);
                  }
                }}
                onEdit={handleEdit}
                onRefresh={refreshUsers}
                onView={() => setIsModalOpen(true)}
              />
            )}
          </CardBody>
        </Card>
      </div>

      <UsersModal
        isOpen={isModalOpen}
        mode={editingUser ? 'edit' : 'create'}
        user={editingUser || undefined}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />

      <ConfirmationModal
        body={`Are you sure you want to delete "${userToDelete?.firstName} ${userToDelete?.lastName}"? This action cannot be undone.`}
        cancelColor="primary"
        cancelText="Cancel"
        confirmColor="danger"
        confirmText="Delete"
        isOpen={isDeleteModalOpen}
        title="Delete User"
        onClose={handleDeleteModalClose}
        onConfirm={() => userToDelete && handleDeleteUser(userToDelete.id)}
      />
    </>
  );
}
