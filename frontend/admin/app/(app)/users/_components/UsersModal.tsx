'use client';

import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserRole,
  UserStatus,
} from '@/types/user';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from '@heroui/react';
import { useState, useEffect } from 'react';

interface UsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => void;
  user?: User;
  mode: 'create' | 'edit';
}

export function UsersModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  mode,
}: UsersModalProps) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    role: user?.role || ('user' as UserRole),
    status: user?.status || ('active' as UserStatus),
    password: '',
    phone: user?.phone || '',
    department: user?.department || '',
    position: user?.position || '',
  });

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: user?.username || '',
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        role: user?.role || ('user' as UserRole),
        status: user?.status || ('active' as UserStatus),
        password: '',
        phone: user?.phone || '',
        department: user?.department || '',
        position: user?.position || '',
      });
    }
  }, [isOpen, user]);

  // Prevent body scroll and layout shift when modal is open
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Add class to body and set scrollbar width
      document.body.classList.add('modal-open');
      document.body.style.setProperty(
        '--scrollbar-width',
        `${scrollbarWidth}px`,
      );

      return () => {
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('--scrollbar-width');
      };
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (mode === 'create') {
      const createData: CreateUserRequest = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        password: formData.password,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
      };

      onSubmit(createData);
    } else {
      const updateData: UpdateUserRequest = {
        id: user!.id,
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        status: formData.status,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
      };

      onSubmit(updateData);
    }
  };

  const isFormValid = () => {
    if (mode === 'create') {
      return (
        formData.username &&
        formData.email &&
        formData.firstName &&
        formData.lastName &&
        formData.password
      );
    }

    return (
      formData.username &&
      formData.email &&
      formData.firstName &&
      formData.lastName
    );
  };

  return (
    <Modal
      backdrop="blur"
      className="mx-4"
      classNames={{
        backdrop: 'bg-black/50 backdrop-blur-sm',
        wrapper: 'overflow-hidden',
        base: 'overflow-hidden',
      }}
      hideCloseButton={false}
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      isOpen={isOpen}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
      placement="center"
      scrollBehavior="inside"
      size="2xl"
      onClose={onClose}
    >
      <ModalContent className="max-h-[90vh] overflow-hidden">
        <ModalHeader className="flex flex-col gap-1 border-b border-default-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <h2 className="text-xl font-bold text-default-900">
            {mode === 'create' ? 'Create New User' : 'Edit User'}
          </h2>
          <p className="text-sm text-default-600">
            {mode === 'create'
              ? 'Add a new user to the system'
              : 'Update user information'}
          </p>
        </ModalHeader>
        <ModalBody className="space-y-6 py-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              isRequired
              className="w-full"
              label="Username"
              placeholder="Enter username"
              size="lg"
              value={formData.username}
              variant="bordered"
              onChange={e =>
                setFormData({ ...formData, username: e.target.value })
              }
            />

            <Input
              isRequired
              className="w-full"
              label="Email"
              placeholder="Enter email address"
              size="lg"
              type="email"
              value={formData.email}
              variant="bordered"
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              isRequired
              className="w-full"
              label="First Name"
              placeholder="Enter first name"
              size="lg"
              value={formData.firstName}
              variant="bordered"
              onChange={e =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />

            <Input
              isRequired
              className="w-full"
              label="Last Name"
              placeholder="Enter last name"
              size="lg"
              value={formData.lastName}
              variant="bordered"
              onChange={e =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>

          {mode === 'create' && (
            <Input
              isRequired
              className="w-full"
              label="Password"
              placeholder="Enter password"
              size="lg"
              type="password"
              value={formData.password}
              variant="bordered"
              onChange={e =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              isRequired
              className="w-full"
              label="Role"
              placeholder="Select role"
              selectedKeys={[formData.role]}
              variant="bordered"
              onChange={e =>
                setFormData({ ...formData, role: e.target.value as UserRole })
              }
            >
              <SelectItem key="admin">Admin</SelectItem>
              <SelectItem key="manager">Manager</SelectItem>
              <SelectItem key="user">User</SelectItem>
              <SelectItem key="guest">Guest</SelectItem>
            </Select>

            {mode === 'edit' && (
              <Select
                isRequired
                className="w-full"
                label="Status"
                placeholder="Select status"
                selectedKeys={[formData.status]}
                variant="bordered"
                onChange={e =>
                  setFormData({
                    ...formData,
                    status: e.target.value as UserStatus,
                  })
                }
              >
                <SelectItem key="active">Active</SelectItem>
                <SelectItem key="inactive">Inactive</SelectItem>
                <SelectItem key="pending">Pending</SelectItem>
                <SelectItem key="suspended">Suspended</SelectItem>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              className="w-full"
              label="Phone"
              placeholder="Enter phone number"
              size="lg"
              value={formData.phone}
              variant="bordered"
              onChange={e =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <Input
              className="w-full"
              label="Department"
              placeholder="Enter department"
              size="lg"
              value={formData.department}
              variant="bordered"
              onChange={e =>
                setFormData({ ...formData, department: e.target.value })
              }
            />
          </div>

          <Input
            className="w-full"
            label="Position"
            placeholder="Enter position/title"
            size="lg"
            value={formData.position}
            variant="bordered"
            onChange={e =>
              setFormData({ ...formData, position: e.target.value })
            }
          />
        </ModalBody>
        <ModalFooter className="border-t border-default-200 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10">
          <Button className="font-medium" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600"
            color="primary"
            isDisabled={!isFormValid()}
            onPress={handleSubmit}
          >
            {mode === 'create' ? 'Create User' : 'Update User'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
