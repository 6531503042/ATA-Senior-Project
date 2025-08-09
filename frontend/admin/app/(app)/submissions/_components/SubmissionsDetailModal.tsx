'use client';

import type { SubmissionItem } from '@/types/submission';

import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';

import SubmissionDetails from './SubmissionDetails';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  item: SubmissionItem | null;
};

export default function SubmissionsDetailModal({
  isOpen,
  onClose,
  item,
}: Props) {
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="center"
      size="lg"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>Submission Details</ModalHeader>
        <ModalBody>{item ? <SubmissionDetails item={item} /> : null}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
