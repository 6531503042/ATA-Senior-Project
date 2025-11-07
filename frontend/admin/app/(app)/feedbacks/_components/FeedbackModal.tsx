'use client';

import type { Feedback } from '@/types/feedback';
import type { Project } from '@/types/project';
import type { Question } from '@/types/question';
import type { Department } from '@/types/department';
import type { User } from '@/types/user';

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, Textarea, Chip, Checkbox, Tooltip } from '@heroui/react';
import { useState, useEffect, useMemo } from 'react';
import { MessageSquare, Calendar, Users, Building, FileText, Clock, Eye, EyeOff, Search, Shield, Building2 } from 'lucide-react';
import { useQuestionMeta } from '@/hooks/useQuestionMeta';

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
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [questionSearch, setQuestionSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [isDepartmentWide, setIsDepartmentWide] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>([]);
  const [statusChoice, setStatusChoice] = useState<'ACTIVE' | 'DRAFT'>('ACTIVE');

  useEffect(() => {
    if (feedback) {
      setTitle(feedback.title || '');
      setDescription(feedback.description || '');
      setSelectedProjectId(feedback.projectId != null ? feedback.projectId.toString() : '');
      setSelectedQuestions(feedback.questionIds || []);
      setStartDate(feedback.startDate || '');
      setEndDate(feedback.endDate || '');
      setAllowAnonymous(feedback.allowAnonymous ?? true);
      setIsDepartmentWide(feedback.isDepartmentWide ?? false);
      setSelectedDepartmentId(feedback.departmentId || '');
      setSelectedUserIds(feedback.targetUserIds?.filter(id => id != null).map(id => id.toString()) || []);
      setSelectedDepartmentIds(feedback.targetDepartmentIds || []);
      // Map active boolean to status
      setStatusChoice(feedback.active ? 'ACTIVE' : 'DRAFT');
    } else {
      setTitle('');
      setDescription('');
      setSelectedProjectId('');
      setSelectedQuestions([]);
      setQuestionSearch('');
      setStartDate('');
      setEndDate('');
      setAllowAnonymous(true);
      setIsDepartmentWide(false);
      setSelectedDepartmentId('');
      setSelectedUserIds([]);
      setSelectedDepartmentIds([]);
      setStatusChoice('ACTIVE'); // Default to ACTIVE instead of DRAFT
    }
  }, [isOpen, feedback]);

  // Filter users (current User type has no project membership; show all users)
  const availableUsers = useMemo(() => {
    return users;
  }, [users]);

  // Filter users by department when department-wide
  const departmentUsers = useMemo(() => {
    if (selectedDepartmentId && isDepartmentWide) {
      return users.filter(user => 
        user.departments?.some(d => d.id.toString() === selectedDepartmentId)
      );
    }
    return [];
  }, [selectedDepartmentId, isDepartmentWide, users]);

  // Question helpers
  const { meta, typeLabel, typeStyle } = useQuestionMeta();

  const filteredQuestions = useMemo(() => {
    const q = (questionSearch || '').toLowerCase();
    if (!q) return questions;
    return questions.filter(x =>
      x.text.toLowerCase().includes(q) ||
      (x.category || '').toLowerCase().includes(q)
    );
  }, [questions, questionSearch]);

  // Render guard must come AFTER hooks to preserve hook order
  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (selectedProjectId) {
        formData.append('projectId', selectedProjectId);
      }
      selectedQuestions.forEach(questionId => {
        if (questionId != null) {
          formData.append('questionIds', questionId.toString());
        }
      });
      if (startDate) {
        formData.append('startDate', startDate);
      }
      if (endDate) {
        formData.append('endDate', endDate);
      }
      formData.append('allowAnonymous', allowAnonymous.toString());
      formData.append('isDepartmentWide', isDepartmentWide.toString());
      if (selectedDepartmentId) {
        formData.append('departmentId', selectedDepartmentId);
      }
      formData.append('status', statusChoice); // Send status instead of active
      selectedUserIds.forEach(userId => {
        if (userId) {
          formData.append('targetUserIds', userId);
        }
      });
      selectedDepartmentIds.forEach(deptId => {
        if (deptId) {
          formData.append('targetDepartmentIds', deptId);
        }
      });
      await onSubmit(formData, mode);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      title.trim() !== '' &&
      description.trim() !== '' &&
      selectedProjectId !== '' &&
      selectedQuestions.length > 0 &&
      startDate !== '' &&
      endDate !== ''
    );
  };

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

  const handleQuestionToggle = (questionId: number) => {
    setSelectedQuestions(prev => prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]);
  };

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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {mode === 'create' ? 'Create Feedback Survey' : 'Edit Feedback Survey'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === 'create' ? 'Create a new feedback survey with scope and visibility control' : 'Update feedback survey settings'}
              </p>
            </div>
          </div>
          {/* Quick status chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip size="sm" variant="flat" color={visibilityStatus.color as any} radius="full">
              {visibilityStatus.text}
            </Chip>
            <Chip size="sm" variant="flat" color={allowAnonymous ? 'success' : 'default'} radius="full" startContent={allowAnonymous ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" /> }>
              {allowAnonymous ? 'Anonymous ON' : 'Anonymous OFF'}
            </Chip>
            <Chip size="sm" variant="flat" color={isDepartmentWide ? 'secondary' : 'default'} radius="full" startContent={<Building2 className="w-3 h-3" /> }>
              {isDepartmentWide ? 'Department-wide' : 'Project-specific'}
            </Chip>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6">
          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 dark:text-gray-400">
              <Shield className="w-4 h-4" />
              Status
            </h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={statusChoice === 'ACTIVE' ? 'solid' : 'bordered'}
                color="success"
                onPress={() => setStatusChoice('ACTIVE')}
              >
                Active
              </Button>
              <Button
                size="sm"
                variant={statusChoice === 'DRAFT' ? 'solid' : 'bordered'}
                color="default"
                onPress={() => setStatusChoice('DRAFT')}
              >
                Draft
              </Button>
              <span className="text-xs text-default-500 ml-2">You can change status later from the list.</span>
            </div>
          </div>
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 dark:text-gray-400">
              <MessageSquare className="w-4 h-4" />
              Basic Information
            </h3>
            <Input isRequired label="Survey Title" placeholder="e.g., Q4 Developer Team Feedback" value={title} onValueChange={setTitle} variant="bordered" />
            <Textarea isRequired label="Description" placeholder="Describe the purpose and scope of this feedback survey" value={description} onValueChange={setDescription} variant="bordered" minRows={3} />
          </div>

          {/* Scope Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 dark:text-gray-400">
              <Building className="w-4 h-4" />
              Scope Configuration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select isRequired label="Project" placeholder="Select a project" selectedKeys={selectedProjectId ? [selectedProjectId] : []} onSelectionChange={(keys) => { const selected = Array.from(keys)[0] as string; setSelectedProjectId(selected); if (!isDepartmentWide) { setSelectedDepartmentId(''); } }} variant="bordered" aria-label="Select project for feedback scope">
                {projects.map((project) => (<SelectItem key={project.id.toString()}>{project.name}</SelectItem>))}
              </Select>
              <Select label="Department" placeholder="Select department (optional)" selectedKeys={selectedDepartmentId ? [selectedDepartmentId] : []} onSelectionChange={(keys) => { const selected = Array.from(keys)[0] as string; setSelectedDepartmentId(selected); }} variant="bordered" aria-label="Select department for feedback scope">
                {departments.map((dept) => (<SelectItem key={dept.id.toString()}>{dept.name}</SelectItem>))}
              </Select>
            </div>
            {/* Friendly toggle buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Tooltip content="Department-wide scope overrides project members">
                <Button
                  variant={isDepartmentWide ? 'solid' : 'bordered'}
                  color={isDepartmentWide ? 'secondary' : 'default'}
                  startContent={<Building2 className="w-4 h-4" />}
                  onPress={() => setIsDepartmentWide(v => !v)}
                  size="sm"
                >
                  {isDepartmentWide ? 'Department-wide' : 'Project-specific'}
                </Button>
              </Tooltip>
              <Tooltip content={allowAnonymous ? 'Anonymous responses enabled' : 'Anonymous responses disabled'}>
                <Button
                  variant={allowAnonymous ? 'solid' : 'bordered'}
                  color={allowAnonymous ? 'success' : 'default'}
                  startContent={allowAnonymous ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  onPress={() => setAllowAnonymous(v => !v)}
                  size="sm"
                >
                  {allowAnonymous ? 'Anonymous ON' : 'Anonymous OFF'}
                </Button>
              </Tooltip>
            </div>
          </div>

          {/* Time-based Visibility */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Visibility Control
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input isRequired type="datetime-local" label="Start Date & Time" value={startDate} onValueChange={setStartDate} variant="bordered" startContent={<Calendar className="w-4 h-4 text-gray-400" />} />
              <Input isRequired type="datetime-local" label="End Date & Time" value={endDate} onValueChange={setEndDate} variant="bordered" startContent={<Calendar className="w-4 h-4 text-gray-400" />} />
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {visibilityStatus.status === 'ACTIVE' ? (<Eye className="w-4 h-4 text-green-600" />) : visibilityStatus.status === 'PENDING' ? (<Clock className="w-4 h-4 text-yellow-600" />) : (<EyeOff className="w-4 h-4 text-red-600" />)}
                <span className="text-sm font-medium text-gray-700">Visibility Status:</span>
                <Chip color={visibilityStatus.color as any} size="sm" variant="flat" radius="full" className="h-6 px-2 text-[11px]">{visibilityStatus.text}</Chip>
              </div>
            </div>
          </div>

          {/* Question Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Survey Questions
            </h3>
            <div className="flex items-center gap-2">
              <Input className="flex-1" placeholder="Search questions..." startContent={<Search className="w-4 h-4 text-gray-400" />} value={questionSearch} onValueChange={setQuestionSearch} variant="bordered" aria-label="Search questions in modal" />
              <span className="text-xs text-gray-500 whitespace-nowrap">{filteredQuestions.length} found</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="light" onPress={() => setSelectedQuestions(filteredQuestions.map(q => q.id))}>Select all</Button>
              <Button size="sm" variant="light" onPress={() => setSelectedQuestions([])}>Clear</Button>
            </div>
            <div className="space-y-3">
              {filteredQuestions.map((question) => {
                const s = typeStyle(question.type);
                return (
                  <div key={question.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-default-50 cursor-pointer" onClick={() => handleQuestionToggle(question.id)}>
                    <Checkbox isSelected={selectedQuestions.includes(question.id)} onValueChange={() => handleQuestionToggle(question.id)} onClick={(e) => e.stopPropagation()} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{question.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-2 rounded-full px-2 h-6 text-[11px] font-medium ${s.bg} ${s.text}`}>
                          <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                          {typeLabel(question.type)}
                        </span>
                        {question.required && (
                          <span className="inline-flex items-center gap-2 rounded-full px-2 h-6 text-[11px] font-medium bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedQuestions.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">Selected: {selectedQuestions.length} question(s)</p>
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
                  <p className="text-sm font-medium text-gray-700 mb-2">Department-wide scope: {departments.find(d => d.id.toString() === selectedDepartmentId)?.name}</p>
                  <p className="text-sm text-gray-600">Available to: {departmentUsers.length} users</p>
                </div>
              ) : selectedProjectId ? (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Project-specific scope: {projects.find(p => p.id.toString() === selectedProjectId)?.name}</p>
                  <p className="text-sm text-gray-600">Available to: {availableUsers.length} project members</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Please select a project or department to define the scope</p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Cancel</Button>
          <Button color="primary" onPress={handleSubmit} isDisabled={!isFormValid() || loading} isLoading={loading}>
            {mode === 'create' ? 'Create Survey' : 'Update Survey'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
