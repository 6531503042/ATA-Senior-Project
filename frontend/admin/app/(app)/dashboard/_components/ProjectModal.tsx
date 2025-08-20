'use client';

import type { Project } from '@/types/dashboard';

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

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Partial<Project>) => void;
  project?: Project;
  mode: 'create' | 'edit';
}

export function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  project,
  mode,
}: ProjectModalProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || 'pending',
    participants: project?.participants?.toString() || '0',
  });

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
    onSubmit({
      ...formData,
      participants: parseInt(formData.participants) || 0,
    });
    onClose();
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
            {mode === 'create' ? 'Create New Project' : 'Edit Project'}
          </h2>
          <p className="text-sm text-default-600">
            {mode === 'create'
              ? 'Add a new project to your dashboard'
              : 'Update project information'}
          </p>
        </ModalHeader>
        <ModalBody className="space-y-6 py-6 overflow-y-auto">
          <Input
            isRequired
            className="w-full"
            label="Project Title"
            placeholder="Enter project title"
            size="lg"
            value={formData.title}
            variant="bordered"
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />

          <Textarea
            isRequired
            className="w-full"
            label="Description"
            maxRows={6}
            minRows={4}
            placeholder="Enter project description"
            value={formData.description}
            variant="bordered"
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  status: e.target.value as Project['status'],
                })
              }
            >
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="completed">Completed</SelectItem>
            </Select>

            <Input
              isRequired
              label="Participants"
              max="1000"
              min="0"
              placeholder="Number of participants"
              type="number"
              value={formData.participants}
              variant="bordered"
              onChange={e =>
                setFormData({ ...formData, participants: e.target.value })
              }
            />
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-default-200 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10">
          <Button className="font-medium" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600"
            color="primary"
            isDisabled={!formData.title || !formData.description}
            onPress={handleSubmit}
          >
            {mode === 'create' ? 'Create Project' : 'Update Project'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
