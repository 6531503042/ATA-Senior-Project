'use client';

import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Button, Chip } from '@heroui/react';
import { MessageSquareTextIcon as FeedbackIcon, ShieldIcon, ReplyIcon, CheckCircle2Icon } from 'lucide-react';
import type { Feedback } from '@/types/feedback';
import { formatDate, statusMeta } from '@/types/feedback';

export default function FeedbackDetailsModal({
  isOpen,
  feedback,
  onClose,
  onResolve,
  onReply,
}: {
  isOpen: boolean;
  feedback?: Feedback;
  onClose: () => void;
  onResolve: (id: string) => void;
  onReply: (f: Feedback) => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>{feedback?.subject}</ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Chip size="sm" variant="flat" startContent={<FeedbackIcon className="w-3 h-3" />}>{feedback?.projectName}</Chip>
              {feedback?.category ? <Chip size="sm" variant="flat">{feedback?.category}</Chip> : null}
              {feedback?.visibility === 'anonymous' ? (
                <Chip size="sm" variant="flat" startContent={<ShieldIcon className="w-3 h-3" />}>Anonymous</Chip>
              ) : (
                <Chip size="sm" variant="flat">Identified</Chip>
              )}
              {feedback ? (
                <Chip size="sm" variant="flat">{statusMeta[feedback.status].label}</Chip>
              ) : null}
            </div>
            <div className="text-xs text-default-500">Submitted: {feedback ? formatDate(feedback.createdAt) : '-'}</div>
            <div className="rounded-xl border border-default-200 bg-default-50 p-4 text-default-800 whitespace-pre-wrap">
              {feedback?.message}
            </div>
            {feedback?.visibility === 'identified' && feedback?.reporter ? (
              <div className="text-sm text-default-600">
                <div className="font-medium mb-1">Reporter</div>
                <div>Name: {feedback.reporter.name || '-'}</div>
                <div>Email: {feedback.reporter.email || '-'}</div>
              </div>
            ) : (
              <div className="text-xs text-default-500 flex items-center gap-2">
                <ShieldIcon className="w-4 h-4" /> Reporter identity hidden (confidential)
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center gap-2">
            <Button variant="light" onPress={onClose}>Close</Button>
            {feedback?.visibility === 'identified' && feedback ? (
              <Button startContent={<ReplyIcon className="w-4 h-4" />} onPress={() => onReply(feedback)}>Reply</Button>
            ) : null}
            {feedback && feedback.status !== 'resolved' ? (
              <Button color="success" startContent={<CheckCircle2Icon className="w-4 h-4" />} onPress={() => onResolve(feedback.id)}>
                Mark Resolved
              </Button>
            ) : null}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}