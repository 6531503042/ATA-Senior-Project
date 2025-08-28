'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
  Select,
  SelectItem,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Shield,
  Users,
  Calendar,
} from 'lucide-react';

import { api } from '../../../libs/apiClient';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadRoles();
  }, [page, searchTerm]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const params = {
        page: page - 1,
        size: 10,
        search: searchTerm || undefined,
      };

      const response = await api.get<any>('/api/roles', params);

      setRoles(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roleId: number) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      await api.delete(`/api/roles/${roleId}`);
      loadRoles();
    } catch (err: any) {
      setError(err.message || 'Failed to delete role');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles Management</h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onPress={onOpen}
        >
          Create Role
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Roles</p>
                <p className="text-lg font-semibold">{roles.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-lg font-semibold">
                  {roles.reduce((sum, role) => sum + role.userCount, 0)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Roles</p>
                <p className="text-lg font-semibold">
                  {roles.filter(r => r.userCount > 0).length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              className="flex-1"
              placeholder="Search roles..."
              startContent={<Search size={16} />}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Roles List</h3>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-gray-600 mt-2">Loading roles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <Button className="mt-2" color="primary" onPress={loadRoles}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              <Table aria-label="Roles table">
                <TableHeader>
                  <TableColumn>ROLE</TableColumn>
                  <TableColumn>DESCRIPTION</TableColumn>
                  <TableColumn>PERMISSIONS</TableColumn>
                  <TableColumn>USERS</TableColumn>
                  <TableColumn>CREATED</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map(role => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{role.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {role.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions
                            .slice(0, 3)
                            .map((permission, index) => (
                              <Chip
                                key={index}
                                color="primary"
                                size="sm"
                                variant="flat"
                              >
                                {permission}
                              </Chip>
                            ))}
                          {role.permissions.length > 3 && (
                            <Chip color="default" size="sm" variant="flat">
                              +{role.permissions.length - 3}
                            </Chip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="text-gray-400" size={16} />
                          <span className="text-sm">{role.userCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="text-gray-400" size={14} />
                          <span className="text-sm">
                            {formatDate(role.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            color="primary"
                            size="sm"
                            startContent={<Eye size={14} />}
                            variant="flat"
                            onPress={() => {
                              setSelectedRole(role);
                              onOpen();
                            }}
                          >
                            View
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            startContent={<Trash2 size={14} />}
                            variant="flat"
                            onPress={() => handleDelete(role.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredRoles.length === 0 && (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">No roles found</p>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            showControls
            color="primary"
            page={page}
            total={totalPages}
            onChange={setPage}
          />
        </div>
      )}

      {/* Role Detail Modal */}
      <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {selectedRole ? 'Role Details' : 'Create New Role'}
          </ModalHeader>
          <ModalBody>
            {selectedRole ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Role Name
                  </label>
                  <p className="text-gray-900">{selectedRole.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <p className="text-gray-900">{selectedRole.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Permissions
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRole.permissions.map((permission, index) => (
                      <Chip
                        key={index}
                        color="primary"
                        size="sm"
                        variant="flat"
                      >
                        {permission}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Users with this role
                  </label>
                  <p className="text-gray-900">{selectedRole.userCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Created
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedRole.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Updated
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedRole.updatedAt)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Input label="Role Name" placeholder="Enter role name" />
                <Textarea
                  label="Description"
                  placeholder="Enter role description"
                  rows={3}
                />
                <Select
                  label="Permissions"
                  placeholder="Select permissions"
                  selectionMode="multiple"
                >
                  <SelectItem key="READ">Read</SelectItem>
                  <SelectItem key="WRITE">Write</SelectItem>
                  <SelectItem key="DELETE">Delete</SelectItem>
                  <SelectItem key="ADMIN">Admin</SelectItem>
                </Select>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Close
            </Button>
            {!selectedRole && <Button color="primary">Create Role</Button>}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
