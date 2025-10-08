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
  allowSelectAll = false, 
  isLoadingMembers = false 
}: DepartmentMembersSelectorProps) {
  const { users, fetchUsers } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
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
    console.group('[DeptMembers] handleSearch');
    console.log('query =', query);
    setSearchQuery(query);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (query.trim()) {
      const timeout = setTimeout(() => {
        console.log('Fetching users (debounced). current query =', query);
        fetchUsers().then(() => {
          console.log('Users fetched. total =', users.length);
          console.groupEnd();
        });
      }, 300);
      setSearchTimeout(timeout);
    } else {
      // Clear users when search is empty
      setSearchQuery('');
      console.log('Empty query, skip fetching');
      console.groupEnd();
    }
  }, [fetchUsers, searchTimeout, users.length]);

  // Toggle member selection
  const handleUserSelect = useCallback((user: User) => {
    console.group('[DeptMembers] handleUserSelect');
    console.log('click user:', { id: user.id, username: user.username });
    
    if (!user.id) {
      console.error('User has no ID:', user);
      console.groupEnd();
      return;
    }
    
    setSelectedMembers(prev => {
      if (prev.some(u => u.id === user.id)) {
        console.log('action: remove');
        return prev.filter(u => u.id !== user.id);
      } else {
        console.log('action: add');
        return [...prev, user];
      }
    });
    // Log the new list on the next tick (after state update)
    setTimeout(() => {
      console.log('selectedMembers (next tick):', selectedMembers.map(u => u.id));
      console.groupEnd();
    }, 0);
  }, [setSelectedMembers, selectedMembers]);

  const handleClearAll = useCallback(() => {
    setSelectedMembers([]);
  }, [setSelectedMembers]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Add Members (Optional)</span>
          <span className="text-xs text-default-500">Select additional members to add to this department</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedMembers.length > 0 && (
            <Button color="default" size="sm" variant="light" onPress={handleClearAll}>Clear All</Button>
          )}
        </div>
      </div>

      {/* All Users Selected UX */}
      {/* Removed Select All UX */}
      {/* Removed Select All Modal */}

      {/* Search Input */}
      <Input 
        label="Search Users" 
        placeholder="Type to search users..."
        startContent={<Users size={20} />} 
        value={searchQuery} 
        onValueChange={handleSearch} 
      />

      {/* Selected Members */}
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
                  <Button 
                    isIconOnly 
                    color="danger" 
                    size="sm" 
                    variant="light" 
                    onPress={() => handleUserSelect(user)}
                  >
                    <X size={12} />
                  </Button>
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

      {/* Search Results */}
      {searchQuery && (
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

      {searchQuery && !users.length && (
        <div className="text-center py-4">
          <span className="text-sm text-default-400">No users found</span>
        </div>
      )}
    </div>
  );
}
