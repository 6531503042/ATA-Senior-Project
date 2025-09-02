'use client';

import type { Project } from '@/types/project';
import type { Department } from '@/types/department';
import type { User } from '@/types/user';

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, Textarea } from '@heroui/react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { FolderIcon, Calendar, X } from 'lucide-react';
import React from 'react';

type ProjectModalProps = {
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, mode: 'create' | 'edit') => void;
  mode: 'create' | 'edit';
  departments?: Department[];
  users?: User[];
  getProjectMembers?: (projectId: number) => Promise<User[]>;
};

export default function ProjectModal({
  project,
  isOpen,
  onClose,
  onSubmit,
  mode,
  departments = [],
  users = [],
  getProjectMembers,
}: ProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [active, setActive] = useState(true);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [existingMembers, setExistingMembers] = useState<User[]>([]);
  const [filterDepartmentId, setFilterDepartmentId] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isOpen && project) {
      setName(project.name);
      setDescription(project.description || '');
      setStartDate(project.startDate ? project.startDate.split('T')[0] : '');
      setEndDate(project.endDate ? project.endDate.split('T')[0] : '');
      setActive(project.active);
      setSelectedDepartmentId(project.departmentId?.toString() || '');
      
      // Load existing members if editing
      if (mode === 'edit' && getProjectMembers) {
        getProjectMembers(project.id).then(setExistingMembers);
      }
    } else {
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setActive(true);
      setSelectedDepartmentId('');
      setSelectedMembers([]);
      setExistingMembers([]);
      setFilterDepartmentId('');
    }
  }, [isOpen, project?.id, mode]); // Removed getProjectMembers from dependencies

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('active', active.toString());
      
      if (selectedDepartmentId) {
        formData.append('departmentId', selectedDepartmentId);
      }
      
      // Add selected members
      selectedMembers.forEach(memberId => {
        formData.append('members', memberId);
      });
      
      // Add existing members (for edit mode)
      existingMembers.forEach(member => {
        formData.append('existingMembers', member.id.toString());
      });

      await onSubmit(formData, mode);
    } catch (error) {
      console.error('Failed to submit project:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeExistingMember = (memberId: number) => {
    setExistingMembers(prev => prev.filter(member => member.id !== memberId));
  };

  // Filter users by selected department
  const filteredUsers = useMemo(() => {
    return filterDepartmentId && filterDepartmentId !== 'all'
      ? users.filter(user => user.departments.some(dept => dept.id.toString() === filterDepartmentId))
      : users;
  }, [filterDepartmentId, users]);

  const isFormValid = name.trim() && description.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
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

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <Select
                     label="Department"
                     placeholder="Select a department"
                     selectedKeys={selectedDepartmentId ? [selectedDepartmentId] : []}
                     onSelectionChange={(keys) => {
                       const selected = Array.from(keys)[0] as string;
                       setSelectedDepartmentId(selected);
                     }}
                     variant="bordered"
                     aria-label="Select project department"
                   >
              {departments.map((dept) => (
                <SelectItem key={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </Select>
          </div> */}

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

          {/* Existing Members */}
          {existingMembers.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Current Members
              </label>
              <div className="flex flex-wrap gap-2">
                {existingMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    <span>{member.firstName} {member.lastName}</span>
                    <button
                      type="button"
                      onClick={() => removeExistingMember(member.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Members */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Add Members
            </label>
            
            {/* Department Filter for Members */}
            <Select
              label="Filter by Department"
              placeholder="All departments"
              selectedKeys={filterDepartmentId ? [filterDepartmentId] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setFilterDepartmentId(selected);
                setSelectedMembers([]); // Clear selected members when filter changes
              }}
              variant="bordered"
              aria-label="Filter members by department"
            >
              <SelectItem key="all">All Departments</SelectItem>
              <React.Fragment>
                {departments.map((dept) => (
                  <SelectItem key={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </React.Fragment>
            </Select>

            <Select
              placeholder="Select members to add"
              selectedKeys={selectedMembers}
              onSelectionChange={(keys) => {
                setSelectedMembers(Array.from(keys) as string[]);
              }}
              selectionMode="multiple"
              variant="bordered"
              aria-label="Select project members"
            >
              {filteredUsers
                .filter(user => !existingMembers.some(member => member.id === user.id))
                .map((user) => (
                  <SelectItem key={user.id.toString()} textValue={`${user.firstName} ${user.lastName}`}>
                    {user.firstName} {user.lastName} 
                    {user.departments.length > 0 && (
                      <span className="text-gray-500 ml-2">
                        ({user.departments.map(d => d.name).join(', ')})
                      </span>
                    )}
                  </SelectItem>
                ))}
            </Select>
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
