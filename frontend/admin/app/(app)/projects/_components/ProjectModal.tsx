'use client';

import type { Project } from '@/types/project';

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, Textarea } from '@heroui/react';
import { useState, useEffect, useRef } from 'react';
import { FolderIcon, Calendar } from 'lucide-react';

type ProjectModalProps = {
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, mode: 'create' | 'edit') => void;
  mode: 'create' | 'edit';
};

export default function ProjectModal({
  project,
  isOpen,
  onClose,
  onSubmit,
  mode,
}: ProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [active, setActive] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isOpen && project) {
      setName(project.name);
      setDescription(project.description || '');
      setCategory(project.category || '');
      setStartDate(project.startDate ? project.startDate.split('T')[0] : '');
      setEndDate(project.endDate ? project.endDate.split('T')[0] : '');
      setActive(project.active);
    } else {
      setName('');
      setDescription('');
      setCategory('');
      setStartDate('');
      setEndDate('');
      setActive(true);
    }
  }, [isOpen, project]);

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('category', category.trim());
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('active', active.toString());

      await onSubmit(formData, mode);
    } catch (error) {
      console.error('Failed to submit project:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = name.trim() && description.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'create' ? 'Create Project' : 'Edit Project'}
              </h2>
              <p className="text-sm text-gray-600">
                {mode === 'create' ? 'Add a new project' : 'Update project information'}
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              isRequired
              label="Project Name"
              placeholder="Enter project name"
              value={name}
              onValueChange={setName}
              variant="bordered"
            />
            <Input
              label="Category"
              placeholder="Enter project category"
              value={category}
              onValueChange={setCategory}
              variant="bordered"
            />
          </div>

          <Textarea
            isRequired
            label="Description"
            placeholder="Enter project description"
            value={description}
            onValueChange={setDescription}
            variant="bordered"
            minRows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={startDate}
              onValueChange={setStartDate}
              variant="bordered"
              startContent={<Calendar className="w-4 h-4 text-gray-400" />}
            />
            <Input
              type="date"
              label="End Date"
              value={endDate}
              onValueChange={setEndDate}
              variant="bordered"
              startContent={<Calendar className="w-4 h-4 text-gray-400" />}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              isSelected={active}
              onValueChange={setActive}
              size="sm"
            />
            <span className="text-sm font-medium text-gray-700">
              {active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!isFormValid || loading}
            isLoading={loading}
          >
            {mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
