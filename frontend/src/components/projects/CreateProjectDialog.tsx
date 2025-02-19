
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RocketLaunchIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { ProjectPrioritySelect } from "./ProjectPrioritySelect";
import { ProjectDetailsForm } from "./ProjectDetailsForm";
import { TeamMembersForm } from "./TeamMembersForm";

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [priority, setPriority] = useState("");
  const [teamMembers, setTeamMembers] = useState([""]);

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, ""]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, value: string) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers[index] = value;
    setTeamMembers(newTeamMembers);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300">
          <PlusCircleIcon className="h-5 w-5" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <RocketLaunchIcon className="h-6 w-6 text-primary" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Launch a new project and set it up for success
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          <ProjectPrioritySelect priority={priority} setPriority={setPriority} />
          <ProjectDetailsForm />
          <TeamMembersForm
            teamMembers={teamMembers}
            addTeamMember={addTeamMember}
            removeTeamMember={removeTeamMember}
            updateTeamMember={updateTeamMember}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            className="gap-2 bg-gradient-to-r from-primary to-primary/90"
            onClick={() => setOpen(false)}
          >
            <RocketLaunchIcon className="h-4 w-4" />
            Launch Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
