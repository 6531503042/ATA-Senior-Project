
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserGroupIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

interface TeamMembersFormProps {
  teamMembers: string[];
  addTeamMember: () => void;
  removeTeamMember: (index: number) => void;
  updateTeamMember: (index: number, value: string) => void;
}

export function TeamMembersForm({
  teamMembers,
  addTeamMember,
  removeTeamMember,
  updateTeamMember,
}: TeamMembersFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Team Members</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTeamMember}
          className="gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Member
        </Button>
      </div>
      <div className="space-y-3">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <UserGroupIcon className="h-4 w-4 text-violet-600" />
            </div>
            <Input
              value={member}
              onChange={(e) => updateTeamMember(index, e.target.value)}
              placeholder="Enter team member name"
              className="flex-1"
            />
            {teamMembers.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTeamMember(index)}
                className="text-gray-400 hover:text-red-600"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
