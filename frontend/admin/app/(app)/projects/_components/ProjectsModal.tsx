"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  DatePicker,
  Chip
} from "@heroui/react";
import { useState, useEffect } from "react";
import { CalendarIcon, UsersIcon, PlusIcon } from "lucide-react";

interface ProjectData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  teamMembers: string[];
  status: "pending" | "active" | "completed";
}

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Partial<ProjectData>) => void;
  project?: Partial<ProjectData>;
  mode: "create" | "edit";
}

export function ProjectsModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  project, 
  mode 
}: ProjectsModalProps) {
  const [formData, setFormData] = useState<ProjectData>({
    name: project?.name || "",
    description: project?.description || "",
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
    teamMembers: project?.teamMembers || [],
    status: project?.status || "pending"
  });

  // Prevent body scroll and layout shift when modal is open
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Add class to body and set scrollbar width
      document.body.classList.add('modal-open');
      document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      
      return () => {
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('--scrollbar-width');
      };
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      teamMembers: [],
      status: "pending"
    });
  };

  const addTeamMember = () => {
    // This would typically open another modal or dropdown to select users
    // For now, we'll just add a placeholder
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, `Member ${prev.teamMembers.length + 1}`]
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="3xl"
      backdrop="blur"
      scrollBehavior="inside"
      placement="center"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      hideCloseButton={false}
      className="mx-4"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
      classNames={{
        backdrop: "bg-black/50 backdrop-blur-sm",
        wrapper: "overflow-hidden",
        base: "overflow-hidden",
      }}
    >
      <ModalContent className="max-h-[90vh] overflow-hidden">
        <ModalHeader className="flex flex-col gap-1 border-b border-default-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <PlusIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-default-900">
                {mode === "create" ? "Create New Project" : "Edit Project"}
              </h2>
              <p className="text-sm text-default-600">
                {mode === "create" ? "Fill in the details to create a new project" : "Update project information"}
              </p>
            </div>
          </div>
        </ModalHeader>
        
        <ModalBody className="space-y-6 py-6 overflow-y-auto">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-default-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter a unique project name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              isRequired
              variant="bordered"
              size="lg"
              className="w-full"
            />
            <p className="text-xs text-default-500 mt-1">Enter a unique project name</p>
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-default-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Enter project description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              minRows={4}
              maxRows={6}
              isRequired
              variant="bordered"
              className="w-full"
            />
            <p className="text-xs text-default-500 mt-1">Provide a detailed project description</p>
          </div>
          
          {/* Start Date & End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-default-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                placeholder="Select start date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                isRequired
                variant="bordered"
                className="w-full"
                startContent={<CalendarIcon className="w-4 h-4 text-default-400" />}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-default-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                placeholder="Select end date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                isRequired
                variant="bordered"
                className="w-full"
                startContent={<CalendarIcon className="w-4 h-4 text-default-400" />}
              />
            </div>
          </div>
          
          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-default-700">
                Team Members
              </label>
              <span className="text-xs text-default-500">
                {formData.teamMembers.length} members selected
              </span>
            </div>
            
            {/* Team Members List */}
            {formData.teamMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.teamMembers.map((member, index) => (
                  <Chip
                    key={index}
                    onClose={() => removeTeamMember(index)}
                    color="primary"
                    variant="flat"
                    size="sm"
                  >
                    {member}
                  </Chip>
                ))}
              </div>
            )}
            
            {/* Add Team Member Button */}
            <Button
              variant="bordered"
              startContent={<UsersIcon className="w-4 h-4" />}
              onPress={addTeamMember}
              className="w-full"
            >
              Add Team Member
            </Button>
          </div>
        </ModalBody>
        
        <ModalFooter className="border-t border-default-200 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10">
          <Button 
            variant="light" 
            onPress={onClose}
            className="font-medium"
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isDisabled={!formData.name || !formData.description}
            className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600"
            startContent={<PlusIcon className="w-4 h-4" />}
          >
            {mode === "create" ? "Create Project" : "Update Project"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
