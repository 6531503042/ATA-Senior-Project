'use client';

import {
  Card,
  CardBody,
  Chip,
  Checkbox,
  Button,
  Select,
  SelectItem,
  Textarea,
  Switch,
} from '@heroui/react';
import { useMemo } from 'react';
import type { Question, AnswerOption } from '@/types/questions';

/** Reuse in parent */
export type FeedbackAnswers = Record<
  string,
  string | string[] | number | boolean
>;

type Props = {
  /** Selected project name */
  projectName: string;
  /** Map of project -> questions list */
  questionsByProject: Record<string, Question[]>;
  /** Currently selected question ids (array for ES5-safe iteration) */
  selectedIds: string[];
  /** Current answers keyed by questionId */
  answers: FeedbackAnswers;
  /** Called when selection changes (returns next ids and a pruned/initialized answers object) */
  onSelectedIdsChange: (ids: string[], nextAnswers: FeedbackAnswers) => void;
  /** Called when a single question's answer changes */
  onAnswerChange: (
    questionId: string,
    value: string | string[] | number | boolean
  ) => void;
  className?: string;
};

function typeLabel(t: Question['type']) {
  switch (t) {
    case 'single_choice':
      return 'Single';
    case 'multiple_choice':
      return 'Multiple';
    case 'text_based':
      return 'Text';
    case 'rating':
      return 'Rating';
    case 'boolean':
      return 'Yes/No';
  }
}

function initAnswerForType(t: Question['type']) {
  switch (t) {
    case 'multiple_choice':
      return [] as string[];
    case 'boolean':
      return false;
    default:
      return ''; // text/single/rating (rating will be coerced later)
  }
}

function getOptionById(opts: AnswerOption[] | undefined, id?: string) {
  if (!opts || !id) return undefined;
  for (let i = 0; i < opts.length; i++) if (opts[i].id === id) return opts[i];
  return undefined;
}

export default function FeedbackQuestionSelect({
  projectName,
  questionsByProject,
  selectedIds,
  answers,
  onSelectedIdsChange,
  onAnswerChange,
  className,
}: Props) {
  const availableQuestions = useMemo(() => {
    const list = projectName ? questionsByProject[projectName] || [] : [];
    const filtered: Question[] = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].isActive) filtered.push(list[i]);
    }
    filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    return filtered;
  }, [projectName, questionsByProject]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const toggleOne = (id: string, makeSelected: boolean) => {
    const nextIdsSet = new Set(selectedIds);
    if (makeSelected) nextIdsSet.add(id);
    else nextIdsSet.delete(id);

    // Build next answers: keep only those in next selection; init new ones
    const next: FeedbackAnswers = {};
    const nextIds = Array.from(nextIdsSet);
    for (let i = 0; i < nextIds.length; i++) {
      const qid = nextIds[i];
      const q = availableQuestions.find((x) => x.id === qid);
      if (!q) continue;
      next[qid] = answers[qid] !== undefined ? answers[qid] : initAnswerForType(q.type);
    }
    onSelectedIdsChange(nextIds, next);
  };

  const selectAll = () => {
    const ids = availableQuestions.map((q) => q.id);
    const next: FeedbackAnswers = {};
    for (let i = 0; i < ids.length; i++) {
      const q = availableQuestions[i];
      next[q.id] = answers[q.id] !== undefined ? answers[q.id] : initAnswerForType(q.type);
    }
    onSelectedIdsChange(ids, next);
  };

  const clearAll = () => onSelectedIdsChange([], {});

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="text-base font-semibold text-default-800">Questions</div>
        <div className="flex items-center gap-2">
          <Chip size="sm" variant="flat">
            {availableQuestions.length} total
          </Chip>
          <Chip size="sm" variant="flat" color="primary">
            {selectedIds.length} selected
          </Chip>
          <Button size="sm" variant="light" onPress={selectAll} isDisabled={!projectName || availableQuestions.length === 0}>
            Select all
          </Button>
          <Button size="sm" variant="light" onPress={clearAll} isDisabled={selectedIds.length === 0}>
            Clear
          </Button>
        </div>
      </div>

      {/* Empty states */}
      {!projectName ? (
        <div className="text-default-500 text-sm border border-dashed border-default-200 rounded-xl p-4">
          Choose a project first to see its questions.
        </div>
      ) : availableQuestions.length === 0 ? (
        <div className="text-default-500 text-sm border border-dashed border-default-200 rounded-xl p-4">
          No questions found for this project.
        </div>
      ) : (
        <>
          {/* Questions list */}
          <div className="space-y-2">
            {availableQuestions.map((q) => {
              const checked = selectedSet.has(q.id);
              return (
                <Card
                  key={q.id}
                  className={`border-default-200 hover:border-default-300 transition-colors ${
                    checked ? 'border-primary-300' : 'border'
                  }`}
                >
                  <CardBody className="py-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        isSelected={checked}
                        onValueChange={(v) => toggleOne(q.id, v)}
                        aria-label={`Select ${q.title}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-default-900 truncate">{q.title}</div>
                          {q.required ? (
                            <Chip size="sm" color="danger" variant="flat">
                              Required
                            </Chip>
                          ) : null}
                          <Chip size="sm" variant="flat">
                            #{q.order ?? 0}
                          </Chip>
                        </div>
                        {q.description ? (
                          <div className="text-xs text-default-500 mt-0.5 line-clamp-2">{q.description}</div>
                        ) : null}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Chip size="sm" variant="flat" color="secondary">
                            {typeLabel(q.type)}
                          </Chip>
                          <Chip size="sm" variant="flat">
                            {q.category}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Answers for selected questions */}
          {selectedIds.length > 0 ? (
            <div className="mt-4 space-y-3">
              {selectedIds.map((id) => {
                const q = availableQuestions.find((x) => x.id === id);
                if (!q) return null;

                switch (q.type) {
                  case 'text_based':
                    return (
                      <div key={id} className="space-y-2 rounded-xl border border-default-200 p-3">
                        <div className="text-sm font-medium text-default-700">
                          {q.title}
                          {q.required ? ' *' : ''}
                        </div>
                        <Textarea
                          placeholder={q.description || 'Type your answer...'}
                          value={(answers[id] as string) || ''}
                          onChange={(e) => onAnswerChange(id, e.target.value)}
                          minRows={3}
                          variant="bordered"
                        />
                      </div>
                    );

                  case 'single_choice': {
                    const current = typeof answers[id] === 'string' ? (answers[id] as string) : '';
                    const selected = current ? new Set([current]) : new Set<string>();
                    return (
                      <div key={id} className="space-y-2 rounded-xl border border-default-200 p-3">
                        <div className="text-sm font-medium text-default-700">
                          {q.title}
                          {q.required ? ' *' : ''}
                        </div>
                        <Select
                          selectedKeys={selected}
                          onSelectionChange={(keys) => {
                            const arr = keys === 'all' ? (q.options || []).map((o) => o.id) : Array.from(keys as Set<string>);
                            onAnswerChange(id, arr.length ? arr[0] : '');
                          }}
                          variant="bordered"
                          placeholder={q.description || 'Select one option'}
                          items={q.options || []}
                        >
                          {(opt: AnswerOption) => <SelectItem key={opt.id}>{opt.text}</SelectItem>}
                        </Select>
                      </div>
                    );
                  }

                  case 'multiple_choice': {
                    const selected =
                      Array.isArray(answers[id]) ? new Set(answers[id] as string[]) : new Set<string>();
                    return (
                      <div key={id} className="space-y-2 rounded-xl border border-default-200 p-3">
                        <div className="text-sm font-medium text-default-700">
                          {q.title}
                          {q.required ? ' *' : ''}
                        </div>
                        <Select
                          selectionMode="multiple"
                          selectedKeys={selected}
                          onSelectionChange={(keys) => {
                            const arr =
                              keys === 'all'
                                ? (q.options || []).map((o) => o.id)
                                : Array.from(keys as Set<string>);
                            onAnswerChange(id, arr);
                          }}
                          variant="bordered"
                          placeholder={q.description || 'Select one or more options'}
                          items={q.options || []}
                        >
                          {(opt: AnswerOption) => <SelectItem key={opt.id}>{opt.text}</SelectItem>}
                        </Select>
                      </div>
                    );
                  }

                  case 'rating': {
                    const ratingOpts: AnswerOption[] =
                      q.options && q.options.length
                        ? q.options
                        : Array.from({ length: 5 }, (_, i) => ({
                            id: String(i + 1),
                            text: String(i + 1),
                            value: i + 1,
                          }));

                    const current = answers[id];
                    const selectedKey =
                      typeof current === 'number' ? String(current) : (current as string) || '';
                    const selected = selectedKey ? new Set([selectedKey]) : new Set<string>();
                    return (
                      <div key={id} className="space-y-2 rounded-xl border border-default-200 p-3">
                        <div className="text-sm font-medium text-default-700">
                          {q.title}
                          {q.required ? ' *' : ''}
                        </div>
                        <Select
                          selectedKeys={selected}
                          onSelectionChange={(keys) => {
                            const arr = keys === 'all' ? ratingOpts.map((o) => o.id) : Array.from(keys as Set<string>);
                            const key = arr[0] || '';
                            const opt = ratingOpts.find((o) => o.id === key);
                            const val = typeof opt?.value === 'number' ? opt.value : Number(key);
                            onAnswerChange(id, val);
                          }}
                          variant="bordered"
                          placeholder={q.description || 'Select a rating'}
                          items={ratingOpts}
                        >
                          {(opt: AnswerOption) => <SelectItem key={opt.id}>{opt.text}</SelectItem>}
                        </Select>
                      </div>
                    );
                  }

                  case 'boolean': {
                    const val = typeof answers[id] === 'boolean' ? (answers[id] as boolean) : false;
                    return (
                      <div key={id} className="space-y-2 rounded-xl border border-default-200 p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-default-700">
                            {q.title}
                            {q.required ? ' *' : ''}
                          </div>
                          <Switch isSelected={val} onValueChange={(v) => onAnswerChange(id, v)} />
                        </div>
                        {q.description ? (
                          <div className="text-xs text-default-500">{q.description}</div>
                        ) : null}
                      </div>
                    );
                  }
                }
              })}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
