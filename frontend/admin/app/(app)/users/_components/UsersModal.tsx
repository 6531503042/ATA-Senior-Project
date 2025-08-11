'use client';

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
  Textarea,
} from '@heroui/react';
import { useState, useEffect } from 'react';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserRole,
  UserStatus,
} from '@/types/user';

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
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      backdrop="blur"
      scrollBehavior="inside"
      placement="center"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      hideCloseButton={false}
      className="mx-4"
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
      classNames={{
        backdrop: 'bg-black/50 backdrop-blur-sm',
        wrapper: 'overflow-hidden',
        base: 'overflow-hidden',
      }}
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
              label="Username"
              placeholder="Enter username"
              value={formData.username}
              onChange={e =>
                setFormData({ ...formData, username: e.target.value })
              }
              isRequired
              variant="bordered"
              size="lg"
              className="w-full"
            />

            <Input
              label="Email"
              placeholder="Enter email address"
              type="email"
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              isRequired
              variant="bordered"
              size="lg"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="First Name"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={e =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              isRequired
              variant="bordered"
              size="lg"
              className="w-full"
            />

            <Input
              label="Last Name"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={e =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              isRequired
              variant="bordered"
              size="lg"
              className="w-full"
            />
          </div>

          {mode === 'create' && (
            <Input
              label="Password"
              placeholder="Enter password"
              type="password"
              value={formData.password}
              onChange={e =>
                setFormData({ ...formData, password: e.target.value })
              }
              isRequired
              variant="bordered"
              size="lg"
              className="w-full"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              label="Role"
              placeholder="Select role"
              selectedKeys={[formData.role]}
              onChange={e =>
                setFormData({ ...formData, role: e.target.value as UserRole })
              }
              isRequired
              variant="bordered"
              className="w-full"
            >
              <SelectItem key="admin">Admin</SelectItem>
              <SelectItem key="manager">Manager</SelectItem>
              <SelectItem key="user">User</SelectItem>
              <SelectItem key="guest">Guest</SelectItem>
            </Select>

            {mode === 'edit' && (
              <Select
                label="Status"
                placeholder="Select status"
                selectedKeys={[formData.status]}
                onChange={e =>
                  setFormData({
                    ...formData,
                    status: e.target.value as UserStatus,
                  })
                }
                isRequired
                variant="bordered"
                className="w-full"
              >
                <SelectItem key="active">Active</SelectItem>
                <SelectItem key="inactive">Inactive</SelectItem>
                <SelectItem key="pending">Pending</SelectItem>
                <SelectItem key="suspended">Suspended</SelectItem>
              </Select>
            )}
            <Select
              label="Department"
              placeholder="Select department"
              selectedKeys={[formData.status]}
              onChange={e =>
                setFormData({
                  ...formData,
                  status: e.target.value as UserStatus,
                })
              }
              isRequired
              variant="bordered"
              className="w-full"
            >
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="inactive">Inactive</SelectItem>
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="suspended">Suspended</SelectItem>
            </Select>
          </div>

          <div className="">
            <Input
              label="Phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={e =>
                setFormData({ ...formData, phone: e.target.value })
              }
              variant="bordered"
              size="lg"
              className="w-full"
            />
          </div>
          <Input
            label="Position"
            placeholder="Enter position/title"
            value={formData.position}
            onChange={e =>
              setFormData({ ...formData, position: e.target.value })
            }
            variant="bordered"
            size="lg"
            className="w-full"
          />
        </ModalBody>
        <ModalFooter className="border-t border-default-200 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10">
          <Button variant="light" onPress={onClose} className="font-medium">
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!isFormValid()}
            className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            {mode === 'create' ? 'Create User' : 'Update User'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
