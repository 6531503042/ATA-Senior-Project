"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  UserIcon,
  X,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { User, TeamMember } from "../models/types";

interface TeamSelectorProps {
  users: User[];
  selectedMembers: TeamMember[];
  onAddMember: (e: React.MouseEvent) => void;
  onRemoveMember: (id: number) => void; // id should be a number now
  onMemberSelect: (id: number, userId: number) => void; // id should be a number now
  disabled?: boolean;
}

export function TeamSelector({
  users,
  selectedMembers,
  onAddMember,
  onRemoveMember,
  onMemberSelect,
  disabled = false,
}: TeamSelectorProps) {
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>(
    {},
  );
  const dropdownRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const getInitials = (name: string | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user && user.name ? user.name : "Select team member";
  };

  const getUserById = (userId: number) => {
    return users.find((u) => u.id === userId);
  };

  const toggleDropdown = (id: number) => {
    if (disabled) return;
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.entries(dropdownRefs.current).forEach(([id, ref]) => {
        if (ref && !ref.contains(event.target as Node) && openDropdowns[id]) {
          setOpenDropdowns((prev) => ({ ...prev, [id]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdowns]);

  return (
    <div className="space-y-4">
      {selectedMembers.some((member) => member.userId > 0) && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedMembers.map((member) => {
            const user = getUserById(member.userId);
            return (
              member.userId > 0 && (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge
                    variant="outline"
                    className="flex items-center gap-2 px-2 py-1 bg-violet-50 text-violet-700 border-violet-200"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={user?.avatar} alt={user?.name || ""} />
                      <AvatarFallback className="text-xs bg-violet-200 text-violet-700">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {user ? user.name : "Unknown User"}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 rounded-full hover:bg-violet-200"
                      onClick={() => onRemoveMember(member.id)}
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                </motion.div>
              )
            );
          })}
        </div>
      )}

      <div className="space-y-3">
        {selectedMembers.map((member) => {
          const isOpen = openDropdowns[member.id] || false;
          const selectedUser = getUserById(member.userId);

          return (
            <div
              key={member.id}
              ref={(el) => (dropdownRefs.current[member.id] = el)}
              className="relative"
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => toggleDropdown(member.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md",
                      "border transition-all duration-200",
                      disabled
                        ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50 cursor-pointer",
                      "border-gray-300 focus:ring-1 focus:ring-violet-500 focus:border-violet-500",
                    )}
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center">
                      {selectedUser ? (
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage
                            src={selectedUser.avatar}
                            alt={selectedUser.name}
                          />
                          <AvatarFallback className="bg-violet-100 text-violet-700">
                            {getInitials(selectedUser.name)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-6 w-6 mr-2 flex items-center justify-center rounded-full bg-violet-100">
                          <UserIcon className="h-3 w-3 text-violet-700" />
                        </div>
                      )}
                      <span className={!selectedUser ? "text-gray-500" : ""}>
                        {selectedUser
                          ? selectedUser.name
                          : "Select team member"}
                      </span>
                    </div>
                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                  </button>

                  {isOpen && (
                    <div
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
                      role="listbox"
                    >
                      {users.length === 0 ? (
                        <div className="px-3 py-2 text-gray-500">
                          No team members available
                        </div>
                      ) : (
                        <>
                          <div className="px-3 py-2 text-gray-500 border-b border-b-black/5 text-xs uppercase font-medium">
                            Select Team Member
                          </div>
                          {users.map((user) => (
                            <div
                              key={user.id}
                              className={cn(
                                "px-3 py-2 flex items-center cursor-pointer",
                                user.id === member.userId
                                  ? "bg-violet-50 text-violet-900"
                                  : "hover:bg-gray-50",
                              )}
                              onClick={() => {
                                onMemberSelect(member.id, user.id);
                                toggleDropdown(member.id);
                              }}
                              role="option"
                              aria-selected={user.id === member.userId}
                            >
                              <div className="flex-grow flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage
                                    src={user.avatar}
                                    alt={user.name}
                                  />
                                  <AvatarFallback className="bg-violet-100 text-violet-700">
                                    {getInitials(user.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {user.role || user.email}
                                  </p>
                                </div>
                              </div>
                              {user.id === member.userId && (
                                <CheckIcon className="h-4 w-4 text-violet-600" />
                              )}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full hover:bg-red-50 border border-gray-200"
                  onClick={() => onRemoveMember(member.id)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4 text-red-500" />
                  <span className="sr-only">Remove team member</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2 gap-2 bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100 w-full transition-all"
        onClick={onAddMember}
        disabled={disabled}
      >
        <UserPlus className="h-4 w-4" />
        <span>Add Team Member</span>
      </Button>
    </div>
  );
}
