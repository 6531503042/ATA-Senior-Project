'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { PlusIcon, UsersIcon, ShieldIcon } from 'lucide-react';

import { UsersModal } from './_components/UsersModal';
import UserTable from './_components/UserTable';
import { ConfirmationModal } from '@/components/modal/ConfirmationModal';

import { PageHeader } from '@/components/ui/page-header';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/types/user';

export default function UsersPage() {
  const {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [filterValue, setFilterValue] = useState('');
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<boolean[]>([]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(parseInt(userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
      // Error is already handled by the hook with toast notifications
    }
  };

  const handleModalClose = () => {
      setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (formData: FormData, mode: 'create' | 'edit') => {
    try {
      if (mode === 'create') {
        const userData = {
          username: formData.get('username') as string,
          email: formData.get('email') as string,
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          password: formData.get('password') as string,
          phone: formData.get('phone') as string || undefined,
          roles: JSON.parse(formData.get('roles') as string),
          active: formData.get('active') === 'true',
          departmentId: formData.get('departmentId') ? parseInt(formData.get('departmentId') as string) : undefined,
        };
        console.log('Creating user with data:', userData);
        await createUser(userData);
      } else if (mode === 'edit' && selectedUser) {
        const userData = {
          username: formData.get('username') as string,
          email: formData.get('email') as string,
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          phone: formData.get('phone') as string || undefined,
          roles: JSON.parse(formData.get('roles') as string),
          active: formData.get('active') === 'true',
          departmentId: formData.get('departmentId') ? parseInt(formData.get('departmentId') as string) : undefined,
        };
        console.log('Updating user with data:', userData);
        await updateUser(selectedUser.id, userData);
      }
      handleModalClose();
    } catch (error) {
      console.error('Failed to submit user:', error);
      // Error is already handled by the hook with toast notifications
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete.id.toString());
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const onSearchChange = (value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue('');
    }
  };

  const onClear = () => {
    setFilterValue('');
  };

  const onRoleChange = (value?: string[]) => {
    setSelectedRole(value || []);
  };

  const onStatusChange = (value?: boolean[]) => {
    setSelectedStatus(value || []);
  };

  // Calculate stats from users data
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.active).length,
    inactiveUsers: users.filter(u => !u.active).length,
    adminUsers: users.filter(u => u.roles.includes('ADMIN')).length,
    superAdminUsers: users.filter(u => u.roles.includes('SUPER_ADMIN')).length,
    regularUsers: users.filter(u => u.roles.includes('USER')).length,
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      description: 'All registered users',
      gradient: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-600 to-indigo-700',
      icon: UsersIcon,
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toString(),
      description: 'Currently active users',
      gradient: 'from-green-400 to-teal-500',
      bgColor: 'from-green-600 to-teal-700',
      icon: UsersIcon,
    },
    {
      title: 'Admin Users',
      value: stats.adminUsers.toString(),
      description: 'Administrator accounts',
      gradient: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-600 to-pink-700',
      icon: ShieldIcon,
    },
    {
      title: 'Super Admin Users',
      value: stats.superAdminUsers.toString(),
      description: 'Super Administrator accounts',
      gradient: 'from-red-400 to-rose-500',
      bgColor: 'from-red-600 to-rose-700',
      icon: ShieldIcon,
    },
  ];

  // Filter users based on search, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch = !filterValue || 
      user.username.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
      `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(filterValue.toLowerCase());

    const matchesRole = selectedRole.length === 0 || 
      selectedRole.some(role => user.roles.includes(role));

    const matchesStatus = selectedStatus.length === 0 || 
      selectedStatus.includes(user.active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <>
      <PageHeader
        description="Manage users and their permissions"
        icon={<UsersIcon />}
      />

      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl">
          <div className="relative z-10 flex items-center gap-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <UsersIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">User Management</h1>
              <p className="text-white/70 mt-1">Manage users and their permissions</p>
            </div>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full sm:w-auto font-semibold bg-white/10 hover:bg-white/20 text-white border-white/20"
              color="default"
              startContent={<PlusIcon className="w-4 h-4" />}
              variant="bordered"
              onPress={handleAddUser}
            >
              Add User
            </Button>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),_transparent_60%)]" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((stat, i) => (
            <Card
              key={i}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 overflow-hidden group"
            >
              <CardBody className="p-6 relative">
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

        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="pb-6">
            <div className="w-full">
              <h3 className="text-xl font-bold text-default-900">
                User List
              </h3>
              <p className="text-sm text-default-600">
                View and manage all users
              </p>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {loading ? (
              <div className="py-6">
                <div className="space-y-3">
                  <div className="h-6 bg-default-100 rounded w-1/3" />
                  <div className="h-4 bg-default-100 rounded w-1/2" />
                </div>
                <div className="mt-4 space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-12 bg-default-100 rounded" />
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-red-500">Error: {error}</div>
              </div>
            ) : (
              <UserTable
                users={filteredUsers}
                onEdit={handleEditUser}
                onDelete={(userId: string) => {
                  const user = filteredUsers.find(u => u.id.toString() === userId);
                  if (user) handleDeleteClick(user);
                }}
                onRefresh={fetchUsers}
                filterValue={filterValue}
                selectedRole={selectedRole}
                selectedStatus={selectedStatus}
                onSearchChange={onSearchChange}
                onClear={onClear}
                onRoleChange={onRoleChange}
                onStatusChange={onStatusChange}
              />
            )}
          </CardBody>
        </Card>
      </div>

      <UsersModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        user={selectedUser || undefined}
        mode={modalMode}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        body={`Are you sure you want to delete ${userToDelete?.username || 'this user'}? This action cannot be undone.`}
      />
    </>
  );
}
