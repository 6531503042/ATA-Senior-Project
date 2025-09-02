'use client';

import type { Feedback } from '@/types/feedback';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem, Chip } from '@heroui/react';
import { MessageSquare, Calendar, FileText, Users, Building, Clock, Eye, EyeOff } from 'lucide-react';

interface FeedbackDetailModalProps {
  feedback: Feedback | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
}

export default function FeedbackDetailModal({
  feedback,
  isOpen,
  onClose,
  onStatusChange,
}: FeedbackDetailModalProps) {
  if (!feedback) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'primary';
      case 'PENDING':
        return 'warning';
      case 'DRAFT':
        return 'default';
      default:
        return 'default';
    }
  };

  const getVisibilityStatus = () => {
    if (!feedback.startDate || !feedback.endDate) {
      return { status: 'NOT_SET', text: 'Visibility not set', color: 'default' };
    }
    
    const now = new Date();
    const start = new Date(feedback.startDate);
    const end = new Date(feedback.endDate);
    
    if (now < start) return { status: 'PENDING', text: 'Not visible yet', color: 'warning' };
    if (now > end) return { status: 'EXPIRED', text: 'Visibility expired', color: 'danger' };
    return { status: 'ACTIVE', text: 'Currently visible', color: 'success' };
  };

  const getScopeText = () => {
    if (feedback.isDepartmentWide && feedback.departmentName) {
      return `Department-wide: ${feedback.departmentName}`;
    }
    if (feedback.projectName) {
      return `Project-specific: ${feedback.projectName}`;
    }
    return 'Custom scope';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(feedback.id, newStatus);
    onClose();
  };

  const visibilityStatus = getVisibilityStatus();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Feedback Survey Details</h2>
              <p className="text-sm text-gray-600">View complete survey information</p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Title
              </label>
              <p className="text-gray-900 text-lg font-semibold mt-1">{feedback.title}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Description
              </label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{feedback.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Scope
                </label>
                <p className="text-gray-900 mt-1">{getScopeText()}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Target Audience
                </label>
                <p className="text-gray-900 mt-1">
                  {feedback.targetUserIds?.length || 0} users, {feedback.targetDepartmentIds?.length || 0} departments
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Chip size="sm" color={getStatusColor(feedback.status) as any} />
                  Status
                </label>
                <div className="mt-2">
                  <Select
                    selectedKeys={[feedback.status]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      handleStatusChange(selected);
                    }}
                    variant="bordered"
                    aria-label="Change feedback status"
                  >
                    <SelectItem key="ACTIVE">Active</SelectItem>
                    <SelectItem key="COMPLETED">Completed</SelectItem>
                    <SelectItem key="PENDING">Pending</SelectItem>
                    <SelectItem key="DRAFT">Draft</SelectItem>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Questions
                </label>
                <p className="text-gray-900 mt-1">{feedback.questionIds?.length || 0} questions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Submissions
                </label>
                <p className="text-gray-900 mt-1">{feedback.submissionCount || 0}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Anonymous Allowed
                </label>
                <p className="text-gray-900 mt-1">
                  {feedback.allowAnonymous ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </label>
                <p className="text-gray-900 mt-1">{formatDate(feedback.startDate)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  End Date
                </label>
                <p className="text-gray-900 mt-1">{formatDate(feedback.endDate)}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Visibility Status
              </label>
              <div className="mt-2">
                <Chip
                  color={visibilityStatus.color as any}
                  size="sm"
                  variant="flat"
                >
                  {visibilityStatus.text}
                </Chip>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Created
                </label>
                <p className="text-gray-900 mt-1">{formatDate(feedback.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Last Updated
                </label>
                <p className="text-gray-900 mt-1">{formatDate(feedback.updatedAt)}</p>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
