'use client';

import type { SubmissionItem } from '@/types/submission';

import { Modal, ModalBody, ModalContent, ModalHeader, Divider } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/utils/api';
import type { Question } from '@/types/question';

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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  // Load feedback questions to map response questionIds -> question text
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!item) return;
      setLoading(true);
      try {
        const feedbackRes = await apiRequest<any>(`/api/feedbacks/${item.feedbackId}`, 'GET');
        const questionIds: number[] = feedbackRes.data?.questionIds || [];
        if (questionIds.length === 0) {
          setQuestions([]);
          return;
        }
        // Fetch questions in parallel
        const results = await Promise.all(
          questionIds.map((id: number) => apiRequest<any>(`/api/questions/${id}`, 'GET').then(r => r.data))
        );
        if (mounted) setQuestions(results);
      } catch {
        if (mounted) setQuestions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [item]);

  const questionMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const q of questions) {
      map.set(q.id, q.text);
    }
    return map;
  }, [questions]);

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
        <ModalBody>
          {item ? (
            <div className="space-y-5">
              <SubmissionDetails item={item} />
              <Divider />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-default-600">Answers</h3>
                <div className="space-y-2">
                  {Object.entries(item.responses || {}).map(([qidStr, answer]) => {
                    const qid = Number(qidStr);
                    const qText = questionMap.get(qid) || `Question #${qid}`;
                    return (
                      <div key={qid} className="rounded-lg border border-default-200 bg-default-50 p-3">
                        <div className="text-xs text-default-500">{qText}</div>
                        <div className="text-sm font-medium text-default-900 mt-0.5 break-words">{String(answer)}</div>
                      </div>
                    );
                  })}
                  {Object.keys(item.responses || {}).length === 0 && (
                    <div className="text-default-400 text-sm">No answers</div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
