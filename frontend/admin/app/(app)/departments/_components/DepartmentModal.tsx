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
  onSubmit: (departmentData: { name: string; description: string; active: boolean }, mode: 'create' | 'edit') => void;
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
      console.log('DEBUG: Setting active state from department:', department.active);
      console.log('DEBUG: Department active type:', typeof department.active);
      setSelectedMembers([]);
      setExistingMembers([]);
    } else {
      setName('');
      setDescription('');
      setActive(true);
      console.log('DEBUG: Setting active state to true for new department');
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
      const departmentData = {
        name: name.trim(),
        description: description.trim(),
        active: active ?? true  // Default to true if active is null/undefined
      };

      // Ensure active field is always included
      console.log('DEBUG: Active state before submit:', active);
      console.log('DEBUG: Department data being sent:', departmentData);
      console.log('DEBUG: Active state type:', typeof active);
      console.log('DEBUG: Active state value:', active);
      
      // Force active to be true if it's undefined or null
      if (active === undefined || active === null) {
        console.warn('Active state is undefined/null, defaulting to true');
        departmentData.active = true;
      }
      
      // Always ensure active is included and is a boolean
      if (typeof departmentData.active !== 'boolean') {
        console.warn('Active is not a boolean, forcing to true');
        departmentData.active = true;
      }
      
      console.log('DEBUG: Final department data:', departmentData);


      // Submit department data first
      const result = await onSubmit(departmentData, mode);
      
      // Handle member assignments separately
      if (selectedMembers.length > 0) {
        const deptId = mode === 'edit' ? departmentId : result?.id;
        if (deptId) {
          await handleMemberAssignments(deptId);
        }
      }
    } catch (error) {
      console.error('Failed to submit department:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberAssignments = async (deptId: number) => {
    try {
      // Get all selected member IDs
      const selectedMemberIds = selectedMembers
        .filter(user => user.id && user.id !== '__SELECT_ALL__' as any)
        .map(user => user.id);

      // Get existing member IDs that should be removed
      const existingMemberIds = existingMembers.map(member => member.id);
      const membersToRemove = existingMemberIds.filter(id => !selectedMemberIds.includes(id));

      // Update users to assign them to this department
      for (const userId of selectedMemberIds) {
        await updateUserDepartment(userId, deptId);
      }

      // Update users to remove them from this department
      for (const userId of membersToRemove) {
        await updateUserDepartment(userId, null);
      }
    } catch (error) {
      console.error('Failed to handle member assignments:', error);
    }
  };

  const updateUserDepartment = async (userId: number, departmentId: number | null) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          departmentId: departmentId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update user ${userId}`);
      }
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {mode === 'create' ? 'Create Department' : 'Edit Department'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
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
                onValueChange={(value) => {
                  console.log('DEBUG: Switch toggled to:', value);
                  console.log('DEBUG: Switch value type:', typeof value);
                  setActive(value);
                }}
                size="sm"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
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
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Department Members</span>
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
