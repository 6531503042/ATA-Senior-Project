'use client';

import { useState, useCallback, useEffect } from 'react';
import { Badge, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Skeleton } from '@heroui/react';
import { Users, UserPlus, X } from 'lucide-react';

import { useUsers } from '@/hooks/useUsers';
import { User } from '@/types/user';

type DepartmentMembersSelectorProps = {
  selectedMembers: User[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<User[]>>;
  allowSelectAll?: boolean;
  isLoadingMembers?: boolean;
};

export function DepartmentMembersSelector({ 
  selectedMembers, 
  setSelectedMembers, 
  allowSelectAll = true, 
  isLoadingMembers = false 
}: DepartmentMembersSelectorProps) {
  const { users, fetchUsers } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showSelectAllModal, setShowSelectAllModal] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);

  // Clear search results when component unmounts or when selectedMembers change
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Debounced search
  const handleSearch = useCallback((query: string) => {
    console.log('Searching for users with query:', query);
    setSearchQuery(query);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (query.trim()) {
      const timeout = setTimeout(() => {
        console.log('Fetching users with query:', query);
        fetchUsers(); // Just fetch all users for now
      }, 300);
      setSearchTimeout(timeout);
    } else {
      // Clear users when search is empty
      setSearchQuery('');
    }
  }, [fetchUsers, searchTimeout]);

  // Toggle member selection
  const handleUserSelect = useCallback((user: User) => {
    console.log('Selecting/deselecting user:', user.username, 'ID:', user.id);
    
    if (!user.id) {
      console.error('User has no ID:', user);
      return;
    }
    
    setSelectedMembers(prev => {
      if (prev.some(u => u.id === user.id)) {
        console.log('Removing user from selected members');
        return prev.filter(u => u.id !== user.id);
      } else {
        console.log('Adding user to selected members');
        return [...prev.filter(u => u.id !== '__SELECT_ALL__' as any), user];
      }
    });
  }, [setSelectedMembers]);

  // Select all users
  const handleSelectAll = useCallback(() => {
    setShowSelectAllModal(true);
  }, []);

  const confirmSelectAll = useCallback(() => {
    setSelectedMembers([{ 
      id: '__SELECT_ALL__' as any, 
      username: 'All Users', 
      firstName: 'All', 
      lastName: 'Users', 
      email: '',
      active: true,
      roles: [],
      departments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as User]);
    setShowSelectAllModal(false);
  }, [setSelectedMembers]);

  const handleClearAll = useCallback(() => {
    setSelectedMembers([]);
  }, [setSelectedMembers]);

  const isSelectAllActive = selectedMembers.some(u => u.id === '__SELECT_ALL__' as any);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Add Members (Optional)</span>
          <span className="text-xs text-default-500">Select additional members to add to this department</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedMembers.length > 0 && !isSelectAllActive && (
            <Button color="default" size="sm" variant="light" onPress={handleClearAll}>Clear All</Button>
          )}
          {allowSelectAll && !isSelectAllActive && (
            <Button 
              className="font-bold shadow-md" 
              color="primary" 
              isDisabled={isSelectAllActive} 
              size="md"
              startContent={<Users size={18} />} 
              variant={isSelectAllActive ? "solid" : "flat"} 
              onPress={handleSelectAll}
            >
              Select All Users
            </Button>
          )}
        </div>
      </div>

      {/* All Users Selected UX */}
      {isSelectAllActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-4 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white text-2xl font-bold">
            <Users size={28} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm flex items-center gap-1">
                <Users size={16} /> All Users Selected
              </span>
              <button
                className="ml-2 text-xs text-blue-600 underline"
                onClick={handleClearAll}
                type="button"
              >
                Cancel
              </button>
            </div>
            <div className="text-blue-700 font-medium">
              All users in the system will be added to this department.
            </div>
            <div className="text-xs text-gray-500 mt-1">
              You cannot select individual users while this option is active.
            </div>
          </div>
        </div>
      )}
      {isSelectAllActive && (
        <div className="border-b border-blue-100 mb-2" />
      )}

      {/* Search Input */}
      {!isSelectAllActive && (
        <Input 
          isDisabled={isSelectAllActive} 
          label="Search Users" 
          placeholder="Type to search users..."
          startContent={<Users size={20} />} 
          value={searchQuery} 
          onValueChange={handleSearch} 
        />
      )}

      {/* Selected Members */}
      {!isSelectAllActive && (
        <div className="space-y-2">
          {isLoadingMembers ? (
            // Skeleton loading for members
            <>
              <span className="text-sm text-default-500">Selected Members:</span>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-1 bg-default-50 rounded-full px-2 py-1">
                    <Skeleton className="w-20 h-4 rounded" />
                    <Skeleton className="w-4 h-4 rounded-full" />
                  </div>
                ))}
              </div>
            </>
          ) : selectedMembers.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-500">Selected Members ({selectedMembers.length}):</span>
                {selectedMembers.length > 5 && !showAllMembers && (
                  <Button
                    size="sm"
                    color="primary"
                    variant="light"
                    onPress={() => setShowAllMembers(true)}
                  >
                    Show All
                  </Button>
                )}
                {showAllMembers && (
                  <Button
                    size="sm"
                    color="default"
                    variant="light"
                    onPress={() => setShowAllMembers(false)}
                  >
                    Show Less
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(showAllMembers ? selectedMembers : selectedMembers.slice(0, 5)).map((user, index) => (
                  <div key={user.id || index} className="flex items-center gap-1 bg-default-50 rounded-full px-2 py-1">
                    <span className="font-medium text-sm">
                      {user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim()}
                    </span>
                    {user.id !== '__SELECT_ALL__' as any && (
                      <Button 
                        isIconOnly 
                        color="danger" 
                        size="sm" 
                        variant="light" 
                        onPress={() => handleUserSelect(user)}
                      >
                        <X size={12} />
                      </Button>
                    )}
                  </div>
                ))}
                {!showAllMembers && selectedMembers.length > 5 && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded-full px-3 py-1">
                    <span className="font-medium text-sm">
                      +{selectedMembers.length - 5} more
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Search Results */}
      {searchQuery && !isSelectAllActive && (
        <div className="space-y-2">
          <span className="text-sm text-default-500">Search Results:</span>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {(() => {
              const availableUsers = users.filter(user => 
                user.id && !selectedMembers.some(u => u.id === user.id)
              );
              return availableUsers.map(user => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors bg-default-50 hover:bg-default-100"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex items-center gap-2">
                    <UserPlus className="text-default-400" size={16} />
                    <span className="text-sm font-medium">
                      {user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim()}
                    </span>
                    {user.firstName && (
                      <span className="ml-2 text-xs text-default-400">
                        {user.firstName} {user.lastName}
                      </span>
                    )}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {searchQuery && !users.length && !isSelectAllActive && (
        <div className="text-center py-4">
          <span className="text-sm text-default-400">No users found</span>
        </div>
      )}

      {/* Select All Confirmation Modal */}
      {allowSelectAll && (
        <Modal 
          isOpen={showSelectAllModal} 
          size="sm" 
          onClose={() => setShowSelectAllModal(false)}
          isDismissable={true}
        >
          <ModalContent>
            <ModalHeader>Select All Users</ModalHeader>
            <ModalBody>
              <p>This will add all users in the system to this department. Are you sure?</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setShowSelectAllModal(false)}>Cancel</Button>
              <Button color="secondary" onPress={confirmSelectAll}>Confirm</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
