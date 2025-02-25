'use client';

import React from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import type { User } from '@/types/auth';

interface TeamMember {
  id: string;
  userId: number;
}

interface TeamSelectorProps {
  users: User[];
  selectedMembers: TeamMember[];
  onAddMember: () => void;
  onRemoveMember: (id: string) => void;
  onMemberSelect: (id: string, userId: number) => void;
  error?: string;
  disabled?: boolean;
}

export function TeamSelector({
  users,
  selectedMembers,
  onAddMember,
  onRemoveMember,
  onMemberSelect,
  error,
  disabled,
}: TeamSelectorProps) {
  const searchTerm = '';

  const filteredUsers = users.filter((user) =>
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedUser = (userId: number) =>
    users.find((user) => user.id === userId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Team Members
        </label>
        <button
          type="button"
          onClick={onAddMember}
          disabled={disabled}
          className={`
            inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg
            ${
              disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }
          `}
        >
          <UserPlus className="w-4 h-4 mr-1.5" />
          Add Member
        </button>
      </div>

      <div className="space-y-3">
        {selectedMembers.map((member) => {
          const user = getSelectedUser(member.userId);
          return (
            <div
              key={member.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullname}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  {user?.fullname.charAt(0) || '?'}
                </div>
              )}

              <div className="flex-1">
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={member.userId || ''}
                      onChange={(e) => onMemberSelect(member.id, Number(e.target.value))}
                      disabled={disabled}
                      className={`
                        w-full pl-9 pr-4 py-2 appearance-none
                        border rounded-lg text-sm
                        ${
                          disabled
                            ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                            : 'bg-white text-gray-900'
                        }
                        ${error ? 'border-red-300' : 'border-gray-300'}
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      `}
                    >
                      <option value="">Select a team member</option>
                      {filteredUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.fullname} - {user.roles.join(', ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {user && (
                  <p className="mt-1 text-sm text-gray-500">
                    {user.roles.join(', ')}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => onRemoveMember(member.id)}
                disabled={disabled}
                className={`
                  p-1.5 rounded-md
                  ${
                    disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-200'
                  }
                `}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {selectedMembers.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No team members selected. Click &quot;Add Member&quot; to start building your team.
        </p>
      )}
    </div>
  );
}