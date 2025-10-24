'use client';

import type { User } from '@/types/user';

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
import { useDepartment } from '@/hooks/useDepartment';
import { useRoles } from '@/hooks/useRoles';

interface UsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, mode: 'create' | 'edit') => void;
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
  const { departments } = useDepartment();
  const { roles, loading: rolesLoading, error: rolesError } = useRoles();
  
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    active: boolean;
    password: string;
    phone: string;
    departmentId: number | null;
  }>({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    roles: user?.roles || ['USER'],
    active: user?.active || true,
    password: '',
    phone: user?.phone || '',
    departmentId: null,
  });

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: user?.username || '',
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        roles: user?.roles || ['USER'],
        active: user?.active || true,
        password: '',
        phone: user?.phone || '',
        departmentId: null,
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
    if (!isFormValid()) return;

    const formDataObj = new FormData();
    formDataObj.append('username', formData.username);
    formDataObj.append('email', formData.email);
    formDataObj.append('firstName', formData.firstName);
    formDataObj.append('lastName', formData.lastName);
    formDataObj.append('roles', JSON.stringify(formData.roles));
    formDataObj.append('active', formData.active.toString());
    formDataObj.append('phone', formData.phone);
    
    // Always send departmentId, even if null/undefined
    if (formData.departmentId !== null && formData.departmentId !== undefined) {
      formDataObj.append('departmentId', formData.departmentId.toString());
    } else {
      formDataObj.append('departmentId', '');
    }

    if (mode === 'create') {
      formDataObj.append('password', formData.password);
    }

    onSubmit(formDataObj, mode);
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

  const departmentOptions = [
    { key: "0", label: "No Department" },
    ...departments.map(dept => ({
      key: dept.id.toString(),
      label: dept.name
    }))
  ];

  // Fallback roles if API fails
  const fallbackRoles = [
    { id: '1', name: 'USER', description: 'Regular user with basic access' },
    { id: '2', name: 'ADMIN', description: 'Administrator role with full access' },
    { id: '3', name: 'SUPER_ADMIN', description: 'Super administrator with full access' }
  ];
  
  const availableRoles = roles.length > 0 ? roles : fallbackRoles;
  
  const roleOptions = availableRoles.map(role => ({
    key: role.name,
    label: role.name
  }));

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
          <h2 className="text-xl font-bold text-default-900 ">
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
              placeholder="Enter password (min 6 chars)"
              size="lg"
              type="password"
              value={formData.password}
              variant="bordered"
              description="Password must be at least 6 characters long"
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
              placeholder={rolesLoading ? "Loading roles..." : rolesError ? "Failed to load roles" : "Select role"}
              selectedKeys={formData.roles.length > 0 ? [formData.roles[0]] : []}
              variant="bordered"
              isDisabled={rolesLoading || !!rolesError}
              isLoading={rolesLoading}
              onSelectionChange={keys => {
                const selected = Array.from(keys) as string[];
                setFormData({ ...formData, roles: selected.length > 0 ? [selected[0]] : [] });
              }}
            >
              {availableRoles.map(role => (
                <SelectItem key={role.name} textValue={role.name}>
                  <div className="flex flex-col">
                    <span className="font-medium">{role.name}</span>
                    {role.description && (
                      <span className="text-xs text-default-500">{role.description}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </Select>

            {mode === 'edit' && (
              <Select
                isRequired
                className="w-full"
                label="Status"
                placeholder="Select status"
                selectedKeys={[formData.active.toString()]}
                variant="bordered"
                onSelectionChange={keys => {
                  const selected = Array.from(keys) as string[];
                  setFormData({
                    ...formData,
                    active: selected[0] === 'true',
                  });
                }}
              >
                <SelectItem key="true">Active</SelectItem>
                <SelectItem key="false">Inactive</SelectItem>
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

            <Select
              className="w-full"
              label="Department"
              placeholder="Select department"
              selectedKeys={formData.departmentId ? [formData.departmentId.toString()] : ["0"]}
              variant="bordered"
              onSelectionChange={keys => {
                const selected = Array.from(keys) as string[];
                setFormData({
                  ...formData,
                  departmentId: selected.length > 0 && selected[0] !== "0" ? parseInt(selected[0]) : null,
                });
              }}
            >
              {departmentOptions.map(dept => (
                <SelectItem key={dept.key}>
                  {dept.label}
                </SelectItem>
              ))}
            </Select>
          </div>
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
