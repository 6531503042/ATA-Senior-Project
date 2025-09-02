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
           const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
         const [existingMembers, setExistingMembers] = useState<User[]>([]);
         const [filterDepartmentId, setFilterDepartmentId] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

           useEffect(() => {
           console.log('=== PROJECT MODAL USEFFECT ===');
           console.log('isOpen:', isOpen);
           console.log('project:', project);
           console.log('mode:', mode);
           
           if (isOpen && project) {
             console.log('Setting project data:', {
               name: project.name,
               description: project.description,
               startDate: project.startDate,
               endDate: project.endDate,
               active: project.active
             });
             
             setName(project.name);
             setDescription(project.description || '');
             setStartDate(project.startDate ? project.startDate.split('T')[0] : '');
             setEndDate(project.endDate ? project.endDate.split('T')[0] : '');
             setActive(project.active);

             // Load existing members if editing
             if (mode === 'edit' && getProjectMembers) {
               console.log('Loading existing members for project:', project.id);
               getProjectMembers(project.id).then(members => {
                 console.log('Loaded existing members:', members);
                 setExistingMembers(members);
               });
             }
           } else {
             console.log('Resetting form data');
             setName('');
             setDescription('');
             setStartDate('');
             setEndDate('');
             setActive(true);
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

             // Add selected members
             if (selectedMembers.length > 0) {
               selectedMembers.forEach(memberId => {
                 formData.append('members', memberId);
               });
             }

             // Add existing members (for edit mode)
             if (existingMembers.length > 0) {
               existingMembers.forEach(member => {
                 formData.append('existingMembers', member.id.toString());
               });
             }

             // Log FormData contents
             console.log('=== PROJECT MODAL SUBMISSION ===');
             console.log('Mode:', mode);
             console.log('Name:', name.trim());
             console.log('Description:', description.trim());
             console.log('Start Date:', startDate);
             console.log('End Date:', endDate);
             console.log('Active:', active);
             console.log('Selected Members:', selectedMembers);
             console.log('Existing Members:', existingMembers.map(m => m.id));
             
             // Log FormData entries
             console.log('=== FORMDATA CONTENTS ===');
             const entries = Array.from(formData.entries());
             entries.forEach(([key, value]) => {
               console.log(`${key}:`, value);
             });
             console.log('=== END FORMDATA ===');

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
           const filtered = filterDepartmentId && filterDepartmentId !== 'all'
             ? users.filter(user => user.departments.some(dept => dept.id.toString() === filterDepartmentId))
             : users;
           
           console.log('=== FILTERED USERS UPDATE ===');
           console.log('Filter department ID:', filterDepartmentId);
           console.log('Total users:', users.length);
           console.log('Filtered users:', filtered.length);
           console.log('Filtered user IDs:', filtered.map(u => u.id));
           
           return filtered;
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

          {/*  */}

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

          {/* Member Management */}
          <div className="space-y-4">
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Management</h3>
              
              {/* Department Filter for Members */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Filter Members by Department
                </label>
                                 <Select
                   placeholder="All departments"
                   selectedKeys={filterDepartmentId ? [filterDepartmentId] : []}
                   onSelectionChange={(keys) => {
                     const selected = Array.from(keys)[0] as string;
                     console.log('=== DEPARTMENT FILTER CHANGE ===');
                     console.log('Previous filter:', filterDepartmentId);
                     console.log('New filter:', selected);
                     console.log('Keys received:', Array.from(keys));
                     setFilterDepartmentId(selected);
                     setSelectedMembers([]); // Clear selected members when filter changes
                   }}
                   variant="bordered"
                   aria-label="Filter members by department"
                   className="max-w-xs"
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
              </div>

              {/* Member Selection */}
              <div className="space-y-3 mt-4">
                <label className="text-sm font-medium text-gray-700">
                  Select Members to Add
                </label>
                                 <Select
                   placeholder="Choose members from filtered department"
                   selectedKeys={selectedMembers}
                   onSelectionChange={(keys) => {
                     const newMembers = Array.from(keys) as string[];
                     console.log('=== MEMBER SELECTION CHANGE ===');
                     console.log('Previous members:', selectedMembers);
                     console.log('New members:', newMembers);
                     console.log('Keys received:', Array.from(keys));
                     setSelectedMembers(newMembers);
                   }}
                   selectionMode="multiple"
                   variant="bordered"
                   aria-label="Select project members"
                   className="w-full"
                 >
                  {filteredUsers
                    .filter(user => !existingMembers.some(member => member.id === user.id))
                    .map((user) => (
                      <SelectItem key={user.id.toString()} textValue={`${user.firstName} ${user.lastName}`}>
                        <div className="flex items-center justify-between w-full">
                          <span>{user.firstName} {user.lastName}</span>
                          {user.departments.length > 0 && (
                            <span className="text-xs text-gray-500 ml-2">
                              {user.departments.map(d => d.name).join(', ')}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                </Select>
                
                {selectedMembers.length > 0 && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Selected: {selectedMembers.length} member(s)
                    </p>
                  </div>
                )}
              </div>
            </div>
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
