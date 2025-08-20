'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from '@heroui/react';
import { useState, useEffect } from 'react';

interface Department {
  id?: string;
  name: string;
  manager: string;
  status: 'active' | 'inactive';
  description?: string;
}

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Department) => void;
  department?: Department;
  mode: 'create' | 'edit';
}

export default function DepartmentModal({
  isOpen,
  onClose,
  onSubmit,
  department,
  mode,
}: DepartmentModalProps) {
  const [formData, setFormData] = useState<Department>({
    name: '',
    manager: '',
    status: 'active',
    description: '',
  });

  // Reset form data on open or when department changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: department?.name || '',
        manager: department?.manager || '',
        status: department?.status || 'active',
        description: department?.description || '',
        id: department?.id,
      });
    }
  }, [isOpen, department]);

  // Prevent body scroll & layout shift
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

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
    if (formData.name.trim() && formData.manager.trim()) {
      onSubmit({
        ...formData,
        name: formData.name.trim(),
        manager: formData.manager.trim(),
        description: formData.description?.trim() || '',
        ...(department?.id ? { id: department.id } : {}),
      });
    }
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && formData.manager.trim() !== '';
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
            transition: { duration: 0.3, ease: 'easeOut' },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: { duration: 0.2, ease: 'easeIn' },
          },
        },
      }}
      placement="center"
      scrollBehavior="inside"
      size="lg"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b border-default-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <h2 className="text-xl font-bold text-default-900">
            {mode === 'create' ? 'Add New Department' : 'Edit Department'}
          </h2>
          <p className="text-sm text-default-600">
            {mode === 'create'
              ? 'Add a new department to the system'
              : 'Update department information'}
          </p>
        </ModalHeader>

        <ModalBody className="space-y-6 py-6 overflow-y-auto">
          <Input
            isRequired
            className="w-full"
            label="Department Name"
            placeholder="Enter department name"
            size="lg"
            value={formData.name}
            variant="bordered"
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            isRequired
            className="w-full"
            label="Manager Name"
            placeholder="Enter manager name"
            size="lg"
            value={formData.manager}
            variant="bordered"
            onChange={e =>
              setFormData({ ...formData, manager: e.target.value })
            }
          />
          <Select
            className="w-full"
            label="Status"
            size="lg"
            value={formData.status}
            variant="bordered"
            onChange={e =>
              setFormData({
                ...formData,
                status: e.target.value as 'active' | 'inactive',
              })
            }
          >
            <SelectItem key="active">Active</SelectItem>
            <SelectItem key="inactive">Inactive</SelectItem>
          </Select>
          <Textarea
            className="w-full"
            label="Description"
            placeholder="Enter description (optional)"
            size="lg"
            value={formData.description}
            variant="bordered"
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
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
            {mode === 'create' ? 'Add Department' : 'Update Department'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
