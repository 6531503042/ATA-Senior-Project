'use client';

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
  Switch,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { PlusIcon, TagIcon } from 'lucide-react';
import type { CreateFeedbackRequest, FeedbackVisibility } from '@/types/feedback';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateFeedbackRequest) => void;
  projectOptions?: string[];
};

export default function FeedbackCreateModal({
  isOpen,
  onClose,
  onSubmit,
  projectOptions = [],
}: Props) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setSubject('');
      setMessage('');
      setProjectName('');
      setCategory('');
      setAnonymous(true);
      setReporterName('');
      setReporterEmail('');
    }
  }, [isOpen]);

  const canSubmit =
    subject.trim().length > 0 &&
    message.trim().length > 0 &&
    projectName.trim().length > 0 &&
    (anonymous || reporterEmail.trim().length > 0);

  const handleSubmit = () => {
    const visibility: FeedbackVisibility = anonymous ? 'anonymous' : 'identified';
    const payload: CreateFeedbackRequest = {
      subject: subject.trim(),
      message: message.trim(),
      projectName: projectName.trim(),
      category: category.trim() || undefined,
      visibility,
      reporter: anonymous
        ? null
        : {
            name: reporterName.trim() || null,
            email: reporterEmail.trim() || null,
          },
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      scrollBehavior="inside"
      placement="center"
      isDismissable={false}
      className="mx-4"
      classNames={{
        backdrop: 'bg-black/50 backdrop-blur-sm',
        wrapper: 'overflow-hidden',
        base: 'overflow-hidden',
      }}
      motionProps={{
        variants: {
          enter: { y: 0, opacity: 1, transition: { duration: 0.25 } },
          exit: { y: -12, opacity: 0, transition: { duration: 0.18 } },
        },
      }}
    >
      <ModalContent className="max-h-[90vh] overflow-hidden">
        <ModalHeader className="flex flex-col gap-1 border-b border-default-200 bg-gradient-to-r from-violet-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
              <PlusIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-default-900">Create Feedback</h2>
              <p className="text-sm text-default-600">Add a new confidential feedback entry</p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-6 py-6 overflow-y-auto">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-default-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Short summary of the feedback"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              isRequired
              variant="bordered"
              size="lg"
            />
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-default-700 mb-2">
              Project <span className="text-red-500">*</span>
            </label>
            {projectOptions.length > 0 ? (
              <Select
                placeholder="Choose a project"
                selectedKeys={projectName ? [projectName] : []}
                onChange={(e) => setProjectName(e.target.value)}
                isRequired
                variant="bordered"
              >
                {projectOptions.map((p) => (
                  <SelectItem key={p}>{p}</SelectItem>
                ))}
              </Select>
            ) : (
              <Input
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                isRequired
                variant="bordered"
              />
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-default-700 mb-2">Category</label>
            <Input
              placeholder="e.g., UX, Performance, Bug, Kudos"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              variant="bordered"
              startContent={<TagIcon className="w-4 h-4 text-default-400" />}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-default-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Describe the issue, suggestion, or compliment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              minRows={5}
              maxRows={8}
              isRequired
              variant="bordered"
            />
          </div>

          {/* Visibility / Reporter */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm">
              <div className="font-medium">Submit as anonymous</div>
              <div className="text-default-500">
                When enabled, reporter identity will be hidden.
              </div>
            </div>
            <Switch isSelected={anonymous} onValueChange={setAnonymous} />
          </div>

          {!anonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-default-700 mb-2">
                  Reporter Name
                </label>
                <Input
                  placeholder="Optional"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  variant="bordered"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-default-700 mb-2">
                  Reporter Email <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="name@example.com"
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  variant="bordered"
                  isRequired
                />
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="border-t border-default-200 bg-gradient-to-r from-violet-50/30 to-blue-50/30">
          <Button variant="light" onPress={onClose} className="font-medium">
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!canSubmit}
            className="font-semibold bg-gradient-to-r from-indigo-600 to-blue-600"
            startContent={<PlusIcon className="w-4 h-4" />}
          >
            Create Feedback
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
