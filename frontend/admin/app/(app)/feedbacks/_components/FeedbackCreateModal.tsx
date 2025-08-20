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
import { useEffect, useMemo, useState } from 'react';
import { PlusIcon, TagIcon } from 'lucide-react';
import type {
  CreateFeedbackRequest,
  FeedbackVisibility,
} from '@/types/feedback';
import type { Question, AnswerOption } from '@/types/questions';
import type { Selection } from '@heroui/react';
import FeedbackQuestionSelect, {
  type FeedbackAnswers,
} from './FeedbackQuestionSelect';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateFeedbackRequest) => void;
  projectOptions?: string[];
  questionsByProject?: Record<string, Question[]>;
};

export default function FeedbackCreateModal({
  isOpen,
  onClose,
  onSubmit,
  projectOptions = [],
  questionsByProject = {},
}: Props) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');

  // Store selected question ids
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set(),
  );

  // Answers by questionId
  const [answers, setAnswers] = useState<
    Record<string, string | string[] | number | boolean>
  >({});

  // Helpers to safely read Selection
  const selectionToKeys = (
    sel: Selection,
    allIds: string[] = [],
  ): Set<string> => {
    if (sel === 'all') return new Set(allIds);
    return new Set(sel as Set<string>);
  };
  const singleFromSelection = (sel: Selection): string => {
    if (sel === 'all') return '';
    const arr = Array.from(sel as Set<string>);
    return arr.length ? arr[0] : '';
  };

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setSubject('');
      setMessage('');
      setProjectName('');
      setCategory('');
      setAnonymous(true);
      setReporterName('');
      setReporterEmail('');
      setSelectedQuestions(new Set());
      setAnswers({});
    }
  }, [isOpen]);

  // Clear Q&A when project changes
  useEffect(() => {
    setSelectedQuestions(new Set());
    setAnswers({});
  }, [projectName]);

  const availableQuestions = useMemo(() => {
    const list = projectName ? questionsByProject[projectName] || [] : [];
    // Only active, sorted by order
    const filtered = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].isActive) filtered.push(list[i]);
    }
    filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    return filtered;
  }, [questionsByProject, projectName]);

  // Helpers for options
  const getOptionById = (opts: AnswerOption[] | undefined, id?: string) => {
    if (!opts || !id) return undefined;
    for (let i = 0; i < opts.length; i++) if (opts[i].id === id) return opts[i];
    return undefined;
  };
  const getTextsByIds = (opts: AnswerOption[] | undefined, ids: string[]) => {
    if (!opts) return ids.slice();
    const out: string[] = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const opt = getOptionById(opts, id);
      out.push(opt ? String(opt.text) : id);
    }
    return out;
  };

  // Validation for required questions
  const requiredQuestionsOk = useMemo(() => {
    const ids = Array.from(selectedQuestions);
    for (let i = 0; i < ids.length; i++) {
      const qid = ids[i];
      const q = availableQuestions.find(x => x.id === qid);
      if (!q) continue;
      const v = answers[qid];

      if (q.required) {
        switch (q.type) {
          case 'text_based':
            if (typeof v !== 'string' || v.trim().length === 0) return false;
            break;
          case 'single_choice':
            if (typeof v !== 'string' || !v) return false;
            break;
          case 'multiple_choice':
            if (!Array.isArray(v) || v.length === 0) return false;
            break;
          case 'rating': {
            const n = typeof v === 'number' ? v : Number(v);
            if (!isFinite(n)) return false;
            break;
          }
          case 'boolean':
            if (typeof v !== 'boolean') return false;
            break;
        }
      }
    }
    return true;
  }, [answers, availableQuestions, selectedQuestions]);

  const canSubmit: boolean =
    Boolean(subject.trim()) &&
    Boolean(message.trim()) &&
    Boolean(projectName.trim()) &&
    (anonymous || Boolean(reporterEmail.trim())) &&
    selectedQuestions.size > 0 &&
    requiredQuestionsOk;

  const handleSubmit = () => {
    const visibility: FeedbackVisibility = anonymous
      ? 'anonymous'
      : 'identified';

    const ids = Array.from(selectedQuestions);
    const normalizedAnswers = ids.map(qid => {
      const q = availableQuestions.find(x => x.id === qid)!;
      let value: string | string[] | number | boolean = answers[qid];

      if (
        q.type === 'single_choice' &&
        typeof value === 'string' &&
        q.options &&
        q.options.length
      ) {
        const opt = getOptionById(q.options, value);
        value = opt ? (opt.text as string) : value;
      } else if (
        q.type === 'multiple_choice' &&
        Array.isArray(value) &&
        q.options &&
        q.options.length
      ) {
        value = getTextsByIds(q.options, value);
      } else if (q.type === 'rating') {
        value = typeof value === 'number' ? value : Number(value);
      }

      return {
        questionId: q.id,
        type: q.type,
        title: q.title,
        value,
      };
    });

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
      answers: normalizedAnswers,
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
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
      <ModalContent className="max-h-[90vh] w-[100vw] max-w-[1100px] overflow-hidden">
        <ModalHeader className="flex flex-col gap-1 border-b border-default-200 bg-gradient-to-r from-violet-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
              <PlusIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-default-900">
                Create Feedback
              </h2>
              <p className="text-sm text-default-600">
                Choose project, select questions, and add answers
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="py-6 overflow-y-auto flex flex-row gap-6">
          {/* Left Body */}
          <div className="flex flex-col gap-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-default-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Short summary of the feedback"
                value={subject}
                onChange={e => setSubject(e.target.value)}
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
                  onSelectionChange={keys =>
                    setProjectName(singleFromSelection(keys))
                  }
                  isRequired
                  variant="bordered"
                >
                  {projectOptions.map(p => (
                    <SelectItem key={p}>{p}</SelectItem>
                  ))}
                </Select>
              ) : (
                <Input
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  isRequired
                  variant="bordered"
                />
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-default-700 mb-2">
                Category
              </label>
              <Input
                placeholder="e.g., UX, Performance, Bug, Kudos"
                value={category}
                onChange={e => setCategory(e.target.value)}
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
                onChange={e => setMessage(e.target.value)}
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
                    onChange={e => setReporterName(e.target.value)}
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
                    onChange={e => setReporterEmail(e.target.value)}
                    variant="bordered"
                    isRequired
                  />
                </div>
              </div>
            )}
          </div>
          {/* Right Body */}
          <div className="flex-1 min-w-[280px]">
            <FeedbackQuestionSelect
              projectName={projectName}
              questionsByProject={questionsByProject || {}}
              selectedIds={Array.from(selectedQuestions)} // parent keeps Set
              answers={answers as FeedbackAnswers}
              onSelectedIdsChange={(ids, nextAnswers) => {
                setSelectedQuestions(new Set(ids)); // keep Set upstream
                setAnswers(nextAnswers);
              }}
              onAnswerChange={(qid, value) => {
                setAnswers(prev => ({ ...prev, [qid]: value }));
              }}
            />
          </div>
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
