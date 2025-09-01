'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button } from '@heroui/react';
import { PlusIcon, UsersIcon } from 'lucide-react';

import { UsersModal } from './_components/UsersModal';
import UserTable from './_components/UserTable';
import TopContent from './_components/TopContent';
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
          phone: formData.get('phone') as string,
          roles: JSON.parse(formData.get('roles') as string),
          active: formData.get('active') === 'true',
          departmentId: formData.get('departmentId') ? parseInt(formData.get('departmentId') as string) : null,
        };
        await createUser(userData);
      } else if (mode === 'edit' && selectedUser) {
        const userData = {
          username: formData.get('username') as string,
          email: formData.get('email') as string,
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          phone: formData.get('phone') as string,
          roles: JSON.parse(formData.get('roles') as string),
          active: formData.get('active') === 'true',
          departmentId: formData.get('departmentId') ? parseInt(formData.get('departmentId') as string) : null,
        };
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-default-600 mt-1">
              Manage users and their permissions
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full sm:w-auto font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
              color="primary"
              startContent={<PlusIcon className="w-4 h-4" />}
              variant="shadow"
              onPress={handleAddUser}
            >
              Add User
            </Button>
          </div>
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
            <TopContent
              filterValue={filterValue}
              onClear={onClear}
              onSearchChange={onSearchChange}
              selectedRole={selectedRole}
              selectedStatus={selectedStatus}
              onRoleChange={onRoleChange}
              onStatusChange={onStatusChange}
              onRefresh={fetchUsers}
            />
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
                users={filteredUsers}
                onEdit={handleEditUser}
                onDelete={(userId: string) => {
                  const user = filteredUsers.find(u => u.id.toString() === userId);
                  if (user) handleDeleteClick(user);
                }}
                onRefresh={fetchUsers}
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
