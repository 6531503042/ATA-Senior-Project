'use client';

import { useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Button } from '@heroui/react';
import type { Feedback } from '@/types/feedback';
import { ReplyIcon } from 'lucide-react';

export default function FeedbackReplyModal({
  isOpen,
  to,
  onClose,
  onSent,
}: {
  isOpen: boolean;
  to?: Feedback;
  onClose: () => void;
  onSent: () => void;
}) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const canSend = (to?.visibility === 'identified') && message.trim().length > 0;

  const send = async () => {
    if (!to || !canSend) return;
    try {
      setSending(true);
      // TODO: POST to your notifications/email service here
      await new Promise((r) => setTimeout(r, 700));
      onSent();
      setMessage('');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader>Reply to feedback</ModalHeader>
        <ModalBody>
          {to?.visibility === 'anonymous' ? (
            <div className="text-default-500 text-sm">Cannot reply: reporter is anonymous.</div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-default-600">
                To: <span className="font-medium">{to?.reporter?.name || to?.reporter?.email || 'Reporter'}</span>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Write your reply..."
                className="w-full rounded-xl border border-default-200 bg-white p-3 text-sm focus:outline-none"
              />
              <div className="flex justify-end">
                <Button isDisabled={!canSend} isLoading={sending} startContent={<ReplyIcon className="w-4 h-4" />} onPress={send}>
                  Send reply
                </Button>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
