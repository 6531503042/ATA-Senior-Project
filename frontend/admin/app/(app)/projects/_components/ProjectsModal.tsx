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
  Chip
} from "@heroui/react";
import { useState, useEffect } from "react";
import { CalendarIcon, UsersIcon, PlusIcon, TagIcon, MapPinIcon } from "lucide-react";
import type { Project, CreateProjectRequest, UpdateProjectRequest, ProjectStatus } from "@/types/project";

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: CreateProjectRequest | UpdateProjectRequest) => void;
  project?: Project;
  mode: "create" | "edit";
}

export function ProjectsModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  project, 
  mode 
}: ProjectsModalProps) {
  const [formData, setFormData] = useState<CreateProjectRequest>({
    name: project?.name || "",
    description: project?.description || "",
    startDate: project?.timeline.startDate || "",
    endDate: project?.timeline.endDate || "",
    teamMembers: project?.team.map(member => member.id) || [],
    status: project?.status || "pending",
    category: project?.category,
    tags: project?.tags,
    client: project?.client,
    location: project?.location
  });

  // Reset form when modal opens/closes or project changes
  useEffect(() => {
    if (isOpen && project) {
      setFormData({
        name: project.name,
        description: project.description,
        startDate: project.timeline.startDate,
        endDate: project.timeline.endDate,
        teamMembers: project.team.map(member => member.id),
        status: project.status,
        category: project.category,
        tags: project.tags,
        client: project.client,
        location: project.location
      });
    } else if (isOpen && mode === 'create') {
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        teamMembers: [],
        status: "pending"
      });
    }
  }, [isOpen, project, mode]);

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
    if (mode === 'create') {
      onSubmit(formData);
    } else if (project) {
      onSubmit({
        id: project.id,
        ...formData
      });
    }
    onClose();
  };

  const addTeamMember = () => {
    // This would typically open another modal or dropdown to select users
    // For now, we'll just add a placeholder
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, `member-${prev.teamMembers.length + 1}`]
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
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

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-default-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Select status"
              selectedKeys={[formData.status]}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
              isRequired
              variant="bordered"
              className="w-full"
            >
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="completed">Completed</SelectItem>
              <SelectItem key="cancelled">Cancelled</SelectItem>
            </Select>
          </div>

          {/* Category & Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-default-700 mb-2">
                Category
              </label>
              <Input
                placeholder="Enter project category"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                variant="bordered"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-default-700 mb-2">
                Client
              </label>
              <Input
                placeholder="Enter client name"
                value={formData.client || ""}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                variant="bordered"
                className="w-full"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-default-700 mb-2">
              Location
            </label>
            <Input
              placeholder="Enter project location"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              variant="bordered"
              className="w-full"
              startContent={<MapPinIcon className="w-4 h-4 text-default-400" />}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-default-700 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  variant="bordered"
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      if (input.value.trim()) {
                        addTag(input.value.trim());
                        input.value = '';
                      }
                    }
                  }}
                />
                <Button
                  variant="bordered"
                  startContent={<TagIcon className="w-4 h-4" />}
                  onPress={() => {
                    const input = document.querySelector('input[placeholder="Add a tag"]') as HTMLInputElement;
                    if (input?.value.trim()) {
                      addTag(input.value.trim());
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      onClose={() => removeTag(tag)}
                      color="primary"
                      variant="flat"
                      size="sm"
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              )}
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
            isDisabled={!formData.name || !formData.description || !formData.startDate || !formData.endDate}
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
