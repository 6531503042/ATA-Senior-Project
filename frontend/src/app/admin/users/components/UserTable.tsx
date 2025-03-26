"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Table from "@/components/ui/Table";
import { 
  AlertCircle, 
  Search, 
  Plus, 
  Mail, 
  UserCircle2, 
  Building2,
  Loader2
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { EditUserModal } from "./EditUserModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { CreateUserModal } from "./CreateUserModal";
import { useUsers } from "../hooks/use-users";
import type { User } from "../models/types";

const TableSkeleton = () => (
  <div className="space-y-3">
    <div className="flex items-center space-x-4 pb-4">
      <Skeleton className="h-10 w-[250px]" />
    </div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-12 w-full" />
      </div>
    ))}
  </div>
);

export function UserTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { users = [], isLoadingUsers, error, refetchUsers } = useUsers();

  const filteredUsers = users?.filter((user) => {
    if (!user) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      user.fullname?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.department?.name.toLowerCase().includes(searchLower)
    );
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    { 
      key: 'user', 
      header: 'User Information',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-violet-100">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.fullname}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <UserCircle2 className="h-6 w-6 text-violet-600" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{user.fullname}</div>
            <div className="text-sm text-gray-500">@{user.username}</div>
            <div className="text-xs text-gray-400 mt-1">
              {user.gender}
            </div>
          </div>
        </div>
      )
    },
    { 
      key: 'contact', 
      header: 'Contact & Department',
      render: (user: User) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-violet-600" />
            <span className="text-sm text-gray-600">{user.department?.name || 'Unassigned'}</span>
            {user.department?.description && (
              <span className="text-xs text-gray-400">({user.department.description})</span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (user: User) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role) => (
            <Badge
              key={role}
              variant={role === 'ROLE_ADMIN' ? 'default' : 'secondary'}
              className={`capitalize ${
                role === 'ROLE_ADMIN' 
                  ? 'bg-violet-100 text-violet-800' 
                  : role === 'ROLE_MANAGER'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {role.replace('ROLE_', '').toLowerCase()}
            </Badge>
          ))}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditUser(user)}
            className="hover:bg-violet-50 hover:text-violet-600"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteUser(user)}
            className="hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load users. Please try again later.</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => refetchUsers()}
          className="gap-2"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserCircle2 className="h-5 w-5 text-violet-500" />
              User Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your organization&apos;s users and their roles
            </p>
          </div>
          <Button 
            className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New User
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name, email, username, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoadingUsers ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TableSkeleton />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Table
                data={filteredUsers}
                columns={columns}
                isLoading={isLoadingUsers}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedUser && (
        <>
          <EditUserModal
            user={selectedUser}
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
          />
          <DeleteUserModal
            user={selectedUser}
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
          />
        </>
      )}

      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
} 