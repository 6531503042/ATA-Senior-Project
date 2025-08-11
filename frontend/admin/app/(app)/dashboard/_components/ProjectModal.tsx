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
import type { Project } from "@/types/dashboard";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Partial<Project>) => void;
  project?: Project;
  mode: "create" | "edit";
}

export function ProjectModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  project, 
  mode 
}: ProjectModalProps) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    status: project?.status || "pending",
    participants: project?.participants?.toString() || "0"
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
    onSubmit({
      ...formData,
      participants: parseInt(formData.participants) || 0
    });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl"
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
          <h2 className="text-xl font-bold text-default-900">
            {mode === "create" ? "Create New Project" : "Edit Project"}
          </h2>
          <p className="text-sm text-default-600">
            {mode === "create" ? "Add a new project to your dashboard" : "Update project information"}
          </p>
        </ModalHeader>
        <ModalBody className="space-y-6 py-6 overflow-y-auto">
          <Input
            label="Project Title"
            placeholder="Enter project title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            isRequired
            variant="bordered"
            size="lg"
            className="w-full"
          />
          
          <Textarea
            label="Description"
            placeholder="Enter project description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            minRows={4}
            maxRows={6}
            isRequired
            variant="bordered"
            className="w-full"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              label="Status"
              placeholder="Select status"
              selectedKeys={[formData.status]}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
              isRequired
              variant="bordered"
              className="w-full"
            >
              <SelectItem key="pending">
                Pending
              </SelectItem>
              <SelectItem key="active">
                Active
              </SelectItem>
              <SelectItem key="completed">
                Completed
              </SelectItem>
            </Select>
            
            <Input
              label="Participants"
              placeholder="Number of participants"
              type="number"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
              isRequired
              variant="bordered"
              min="0"
              max="1000"
            />
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
            isDisabled={!formData.title || !formData.description}
            className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            {mode === "create" ? "Create Project" : "Update Project"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 