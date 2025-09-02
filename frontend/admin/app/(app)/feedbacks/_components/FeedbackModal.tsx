'use client';

import type { Feedback } from '@/types/feedback';
import type { Project } from '@/types/project';
import type { Question } from '@/types/question';
import type { Department } from '@/types/department';
import type { User } from '@/types/user';

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, Textarea, Chip, Checkbox } from '@heroui/react';
import { useState, useEffect, useMemo } from 'react';
import { MessageSquare, Calendar, Users, Building, FileText, Clock, Eye, EyeOff } from 'lucide-react';

type FeedbackModalProps = {
  feedback?: Feedback;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, mode: 'create' | 'edit') => void;
  mode: 'create' | 'edit';
  projects?: Project[];
  questions?: Question[];
  departments?: Department[];
  users?: User[];
};

export default function FeedbackModal({
  feedback,
  isOpen,
  onClose,
  onSubmit,
  mode,
  projects = [],
  questions = [],
  departments = [],
  users = [],
}: FeedbackModalProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [isDepartmentWide, setIsDepartmentWide] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && feedback) {
      setTitle(feedback.title);
      setDescription(feedback.description);
      setSelectedProjectId(feedback.projectId.toString());
      setSelectedQuestions(feedback.questionIds.map(id => id.toString()));
      setStartDate(feedback.startDate);
      setEndDate(feedback.endDate);
      setAllowAnonymous(feedback.allowAnonymous);
      setIsDepartmentWide(feedback.isDepartmentWide);
      setSelectedDepartmentId(feedback.departmentId);
      setSelectedUserIds(feedback.targetUserIds.map(id => id.toString()));
      setSelectedDepartmentIds(feedback.targetDepartmentIds);
    } else {
      setTitle('');
      setDescription('');
      setSelectedProjectId('');
      setSelectedQuestions([]);
      setStartDate('');
      setEndDate('');
      setAllowAnonymous(true);
      setIsDepartmentWide(false);
      setSelectedDepartmentId('');
      setSelectedUserIds([]);
      setSelectedDepartmentIds([]);
    }
  }, [isOpen, feedback]);

  // Filter users based on selected project
  const availableUsers = useMemo(() => {
    if (selectedProjectId && !isDepartmentWide) {
      const project = projects.find(p => p.id.toString() === selectedProjectId);
      if (project) {
        // Return users that are members of the selected project
        return users.filter(user => 
          user.projects?.some(p => p.id.toString() === selectedProjectId)
        );
      }
    }
    return users;
  }, [selectedProjectId, isDepartmentWide, projects, users]);

  // Filter users based on selected department
  const departmentUsers = useMemo(() => {
    if (selectedDepartmentId && isDepartmentWide) {
      return users.filter(user => 
        user.departments?.some(d => d.id.toString() === selectedDepartmentId)
      );
    }
    return [];
  }, [selectedDepartmentId, isDepartmentWide, users]);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !selectedProjectId || selectedQuestions.length === 0 || !startDate || !endDate) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('projectId', selectedProjectId);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('allowAnonymous', allowAnonymous.toString());
      formData.append('isDepartmentWide', isDepartmentWide.toString());
      formData.append('departmentId', selectedDepartmentId);

      // Add selected questions
      selectedQuestions.forEach(questionId => {
        formData.append('questionIds', questionId);
      });

      // Add target users and departments based on scope
      if (isDepartmentWide && selectedDepartmentId) {
        formData.append('targetDepartmentIds', selectedDepartmentId);
      } else if (selectedProjectId) {
        // Add users from selected project
        availableUsers.forEach(user => {
          formData.append('targetUserIds', user.id.toString());
        });
      }

      // Add custom selected users if any
      selectedUserIds.forEach(userId => {
        formData.append('targetUserIds', userId);
      });

      await onSubmit(formData, mode);
      onClose();
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = title.trim() && description.trim() && selectedProjectId && selectedQuestions.length > 0 && startDate && endDate;

  const getVisibilityStatus = () => {
    if (!startDate || !endDate) return { status: 'NOT_SET', text: 'Visibility not set', color: 'default' };
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return { status: 'PENDING', text: 'Not visible yet', color: 'warning' };
    if (now > end) return { status: 'EXPIRED', text: 'Visibility expired', color: 'danger' };
    return { status: 'ACTIVE', text: 'Currently visible', color: 'success' };
  };

  const visibilityStatus = getVisibilityStatus();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'create' ? 'Create Feedback Survey' : 'Edit Feedback Survey'}
              </h2>
              <p className="text-sm text-gray-600">
                {mode === 'create' ? 'Create a new feedback survey with scope and visibility control' : 'Update feedback survey settings'}
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Basic Information
            </h3>
            
            <Input
              isRequired
              label="Survey Title"
              placeholder="e.g., Q4 Developer Team Feedback"
              value={title}
              onValueChange={setTitle}
              variant="bordered"
            />

            <Textarea
              isRequired
              label="Description"
              placeholder="Describe the purpose and scope of this feedback survey"
              value={description}
              onValueChange={setDescription}
              variant="bordered"
              minRows={3}
            />
          </div>

          {/* Scope Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Scope Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                isRequired
                label="Project"
                placeholder="Select a project"
                selectedKeys={selectedProjectId ? [selectedProjectId] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setSelectedProjectId(selected);
                  // Clear department selection when project changes
                  if (!isDepartmentWide) {
                    setSelectedDepartmentId('');
                  }
                }}
                variant="bordered"
                aria-label="Select project for feedback scope"
              >
                {projects.map((project) => (
                  <SelectItem key={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Department"
                placeholder="Select department (optional)"
                selectedKeys={selectedDepartmentId ? [selectedDepartmentId] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setSelectedDepartmentId(selected);
                }}
                variant="bordered"
                aria-label="Select department for feedback scope"
              >
                {departments.map((dept) => (
                  <SelectItem key={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Switch
                isSelected={isDepartmentWide}
                onValueChange={setIsDepartmentWide}
                size="sm"
              />
              <span className="text-sm font-medium text-gray-700">
                Department-wide scope (overrides project-specific members)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Switch
                isSelected={allowAnonymous}
                onValueChange={setAllowAnonymous}
                size="sm"
              />
              <span className="text-sm font-medium text-gray-700">
                Allow anonymous responses
              </span>
            </div>
          </div>

          {/* Time-based Visibility */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Visibility Control
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                isRequired
                type="datetime-local"
                label="Start Date & Time"
                value={startDate}
                onValueChange={setStartDate}
                variant="bordered"
                startContent={<Calendar className="w-4 h-4 text-gray-400" />}
              />
              <Input
                isRequired
                type="datetime-local"
                label="End Date & Time"
                value={endDate}
                onValueChange={setEndDate}
                variant="bordered"
                startContent={<Calendar className="w-4 h-4 text-gray-400" />}
              />
            </div>

            {/* Visibility Status */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {visibilityStatus.status === 'ACTIVE' ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : visibilityStatus.status === 'PENDING' ? (
                  <Clock className="w-4 h-4 text-yellow-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  Visibility Status:
                </span>
                <Chip
                  color={visibilityStatus.color as any}
                  size="sm"
                  variant="flat"
                >
                  {visibilityStatus.text}
                </Chip>
              </div>
            </div>
          </div>

          {/* Question Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Survey Questions
            </h3>

            <div className="space-y-3">
              {questions.map((question) => (
                <div key={question.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Checkbox
                    isSelected={selectedQuestions.includes(question.id.toString())}
                    onValueChange={(selected) => {
                      if (selected) {
                        setSelectedQuestions(prev => [...prev, question.id.toString()]);
                      } else {
                        setSelectedQuestions(prev => prev.filter(id => id !== question.id.toString()));
                      }
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{question.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip size="sm" variant="flat" color="primary">
                        {question.type}
                      </Chip>
                      {question.required && (
                        <Chip size="sm" variant="flat" color="danger">
                          Required
                        </Chip>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedQuestions.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Selected: {selectedQuestions.length} question(s)
                </p>
              </div>
            )}
          </div>

          {/* Target Audience Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Target Audience
            </h3>

            <div className="p-4 bg-gray-50 rounded-lg">
              {isDepartmentWide && selectedDepartmentId ? (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Department-wide scope: {departments.find(d => d.id.toString() === selectedDepartmentId)?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Available to: {departmentUsers.length} users
                  </p>
                </div>
              ) : selectedProjectId ? (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Project-specific scope: {projects.find(p => p.id.toString() === selectedProjectId)?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Available to: {availableUsers.length} project members
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Please select a project or department to define the scope
                </p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!isFormValid || loading}
            isLoading={loading}
          >
            {mode === 'create' ? 'Create Survey' : 'Update Survey'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
