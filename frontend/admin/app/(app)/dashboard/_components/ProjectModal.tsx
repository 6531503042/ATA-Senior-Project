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
import { useState } from "react";
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

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      participants: parseInt(formData.participants) || 0
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {mode === "create" ? "Create New Project" : "Edit Project"}
        </ModalHeader>
        <ModalBody className="space-y-4">
          <Input
            label="Project Title"
            placeholder="Enter project title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            isRequired
          />
          
          <Textarea
            label="Description"
            placeholder="Enter project description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            minRows={3}
            isRequired
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              placeholder="Select status"
              selectedKeys={[formData.status]}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
              isRequired
            >
              <SelectItem key="pending">
                <Chip color="warning" variant="flat" size="sm">Pending</Chip>
              </SelectItem>
              <SelectItem key="active">
                <Chip color="success" variant="flat" size="sm">Active</Chip>
              </SelectItem>
              <SelectItem key="completed">
                <Chip color="primary" variant="flat" size="sm">Completed</Chip>
              </SelectItem>
            </Select>
            
            <Input
              label="Participants"
              placeholder="Number of participants"
              type="number"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
              isRequired
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isDisabled={!formData.title || !formData.description}
          >
            {mode === "create" ? "Create Project" : "Update Project"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 