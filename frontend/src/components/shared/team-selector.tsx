'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { User as UserType } from '@/types/auth';

interface TeamSelectorProps {
  users: UserType[];
  selectedMembers: { id: string; userId: number }[];
  onAddMember: () => void;
  onRemoveMember: (id: string) => void;
  onMemberSelect: (id: string, userId: number) => void;
  disabled?: boolean;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (userId: number) => {
  const colors = [
    'bg-violet-100 text-violet-700',
    'bg-blue-100 text-blue-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-indigo-100 text-indigo-700',
    'bg-cyan-100 text-cyan-700',
    'bg-pink-100 text-pink-700',
    'bg-teal-100 text-teal-700',
  ];
  return colors[userId % colors.length];
};

export function TeamSelector({
  users,
  selectedMembers,
  onAddMember,
  onRemoveMember,
  onMemberSelect,
  disabled = false,
}: TeamSelectorProps) {
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {selectedMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border",
              "bg-white hover:bg-gray-50/80 transition-colors",
              "group"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full",
              getRandomColor(member.userId),
              "transition-transform group-hover:scale-105"
            )}>
              {getInitials(users.find(u => u.id === member.userId)?.fullname || 'User')}
            </div>
            
            <div className="flex-1 min-w-0">
              <Select
                value={String(member.userId)}
                onValueChange={(value) => onMemberSelect(member.id, Number(value))}
                disabled={disabled}
              >
                <SelectTrigger className={cn(
                  "w-full border-0 bg-transparent p-0 h-auto",
                  "focus:ring-0 focus:ring-offset-0",
                  "text-sm font-medium"
                )}>
                  <SelectValue>
                    {users.find(u => u.id === member.userId)?.fullname || 'Select member'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={String(user.id)}
                      className={cn(
                        "cursor-pointer",
                        selectedMembers.some(m => m.userId === user.id) &&
                        "opacity-50 cursor-not-allowed"
                      )}
                      disabled={selectedMembers.some(m => m.userId === user.id)}
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{user.fullname}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 truncate">
                {users.find(u => u.id === member.userId)?.email}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveMember(member.id)}
              disabled={disabled}
              className={cn(
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-200",
                "hover:bg-red-50 hover:text-red-600"
              )}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ height: selectedMembers.length === 0 ? "auto" : "48px" }}
        className="overflow-hidden"
      >
        <Button
          variant="outline"
          onClick={onAddMember}
          disabled={disabled}
          className={cn(
            "w-full border-dashed",
            "hover:border-violet-500 hover:text-violet-600",
            "transition-colors duration-200"
          )}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </motion.div>
    </div>
  );
}