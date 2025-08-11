"use client";

import { Modal, ModalBody, ModalContent, ModalHeader, Chip } from "@heroui/react";
import type { SubmissionItem } from "@/types/submission";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  item: SubmissionItem | null;
};

export default function SubmissionsDetailModal({ isOpen, onClose, item }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" backdrop="blur" placement="center">
      <ModalContent>
        <ModalHeader>Submission Details</ModalHeader>
        <ModalBody>
          {item ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-default-500">ID</span>
                <span className="font-medium">#{item.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-default-500">Feedback</span>
                <span className="font-medium">{item.feedbackTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-default-500">Project</span>
                <span className="font-medium">{item.projectName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-default-500">Submitted By</span>
                <span className="font-medium">{item.submittedBy ? `User #${item.submittedBy}` : "Anonymous"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-default-500">Privacy</span>
                <Chip size="sm" color={item.privacy === "PUBLIC" ? "success" : "warning"} variant="flat">
                  {item.privacy}
                </Chip>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-default-500">Status</span>
                <Chip size="sm" color={item.status === "analyzed" ? "success" : item.status === "pending" ? "primary" : "danger"} variant="flat">
                  {item.status}
                </Chip>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-default-500">Sentiment</span>
                {item.overallSentiment ? (
                  <Chip size="sm" color={item.overallSentiment === "positive" ? "success" : item.overallSentiment === "neutral" ? "default" : "danger"} variant="flat">
                    {item.overallSentiment}
                  </Chip>
                ) : (
                  <span className="text-default-400">—</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-default-500">Submitted At</span>
                <span className="font-medium">{new Date(item.submittedAt).toLocaleString()}</span>
              </div>
            </div>
          ) : null}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}


