'use client';

import type { Department, DepartmentMember } from '@/types/department';
import type { User } from '@/types/user';

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch } from '@heroui/react';
import { useState, useEffect, useRef } from 'react';
import { Building2, Users } from 'lucide-react';

import { DepartmentMembersSelector } from './DepartmentMembersSelector';

type DepartmentModalProps = {
  department?: Department;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, mode: 'create' | 'edit') => void;
  mode: 'create' | 'edit';
  getDepartmentMembers?: (departmentId: number) => Promise<DepartmentMember[]>;
};

export default function DepartmentModal({
  department,
  isOpen,
  onClose,
  onSubmit,
  mode,
  getDepartmentMembers,
}: DepartmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [existingMembers, setExistingMembers] = useState<DepartmentMember[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  // Memoize department ID to prevent unnecessary re-renders
  const departmentId = department?.id;

  useEffect(() => {
    if (isOpen && department) {
      setName(department.name);
      setDescription(department.description || '');
      setActive(department.active);
      setSelectedMembers([]);
      setExistingMembers([]);
    } else {
      setName('');
      setDescription('');
      setActive(true);
      setSelectedMembers([]);
      setExistingMembers([]);
    }
  }, [isOpen, department]);

  // Separate useEffect for loading members to prevent unnecessary calls
  useEffect(() => {
    if (mode === 'edit' && departmentId && isOpen && getDepartmentMembers) {
      const loadMembers = async () => {
        try {
          setLoadingMembers(true);
          const members = await getDepartmentMembers(departmentId);
          if (members && Array.isArray(members)) {
            setExistingMembers(members);
          }
        } catch (error) {
          console.error('Failed to load department members:', error);
        } finally {
          setLoadingMembers(false);
        }
      };
      loadMembers();
    }
  }, [mode, departmentId, isOpen, getDepartmentMembers]);

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('active', active.toString());
      
      // Add members if any are selected
      if (selectedMembers.length > 0) {
        const memberIds = selectedMembers
          .filter(user => user.id && user.id !== '__SELECT_ALL__' as any)
          .map(user => user.id.toString());
        
        if (memberIds.length > 0) {
          formData.append('members', JSON.stringify(memberIds));
        }
      }

      // Add existing members that weren't removed (for edit mode)
      if (mode === 'edit' && existingMembers.length > 0) {
        const existingMemberIds = existingMembers.map(member => member.id.toString());
        formData.append('existingMembers', JSON.stringify(existingMemberIds));
      }

      await onSubmit(formData, mode);
    } catch (error) {
      console.error('Failed to submit department:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeExistingMember = (memberId: number) => {
    setExistingMembers(existingMembers.filter(member => member.id !== memberId));
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
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'create' ? 'Create Department' : 'Edit Department'}
              </h2>
              <p className="text-sm text-gray-600">
                {mode === 'create' ? 'Add a new department' : 'Update department information'}
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              isRequired
              label="Department Name"
              placeholder="Enter department name"
              value={name}
              onValueChange={setName}
              variant="bordered"
            />
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
          </div>

          <Input
            isRequired
            label="Description"
            placeholder="Enter department description"
            value={description}
            onValueChange={setDescription}
            variant="bordered"
          />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Department Members</span>
            </div>
            
            {/* Show existing members if editing */}
            {mode === 'edit' && existingMembers.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Current Members ({existingMembers.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {existingMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      <span>{member.username || `${member.firstName || ''} ${member.lastName || ''}`.trim()}</span>
                      <button
                        type="button"
                        onClick={() => removeExistingMember(member.id)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DepartmentMembersSelector
              selectedMembers={selectedMembers}
              setSelectedMembers={setSelectedMembers}
              allowSelectAll={false}
              isLoadingMembers={loadingMembers}
            />
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
