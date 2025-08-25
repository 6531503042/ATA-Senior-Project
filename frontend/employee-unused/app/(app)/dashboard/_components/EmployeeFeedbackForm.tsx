'use client';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Textarea,
  Select,
  SelectItem,
  Switch,
} from '@heroui/react';
import { useMemo, useState } from 'react';
import type { Question, AnswerOption } from '@/types/questions';

type Props = {
  projectName: string;
  questions: Question[];
  onSubmit?: (payload: {
    projectName: string;
    answers: Array<{ questionId: string; title: string; type: Question['type']; value: string | string[] | number | boolean }>;
  }) => void;
};

function ratingOptions(q: Question): AnswerOption[] {
  if (q.options && q.options.length) return q.options;
  return Array.from({ length: 5 }, (_, i) => ({ id: String(i + 1), text: String(i + 1), value: i + 1 }));
}

export default function EmployeeFeedbackForm({ projectName, questions, onSubmit }: Props) {
  const [answers, setAnswers] = useState<Record<string, string | string[] | number | boolean>>({});

  const requiredOk = useMemo(() => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.required) continue;
      const v = answers[q.id];

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
          if (!Number.isFinite(n)) return false;
          break;
        }
        case 'boolean':
          if (typeof v !== 'boolean') return false;
          break;
      }
    }
    return true;
  }, [answers, questions]);

  const handleSubmit = () => {
    const normalized = questions.map((q) => {
      let value: string | string[] | number | boolean = answers[q.id];

      if (q.type === 'rating') {
        value = typeof value === 'number' ? value : Number(value);
      }
      return { questionId: q.id, title: q.title, type: q.type, value };
    });

    const payload = { projectName, answers: normalized };
    console.log('Submitting employee feedback payload:', payload);
    onSubmit?.(payload);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-default-900">Assigned Feedback Form</h3>
          <Chip size="sm" variant="flat" color="primary">{projectName}</Chip>
        </div>
        <p className="text-default-600 text-sm">Please answer the questions below. Required fields are marked with *</p>
      </CardHeader>

      <CardBody className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-default-500 text-sm border border-dashed border-default-200 rounded-xl p-4">
            No questions assigned yet.
          </div>
        ) : (
          questions.map((q) => {
            switch (q.type) {
              case 'text_based':
                return (
                  <div key={q.id} className="space-y-2 rounded-xl border border-default-200 p-3">
                    <div className="text-sm font-medium text-default-700">
                      {q.title}{q.required ? ' *' : ''}
                    </div>
                    {q.description ? <div className="text-xs text-default-500">{q.description}</div> : null}
                    <Textarea
                      placeholder="Type your answer…"
                      value={(answers[q.id] as string) || ''}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      minRows={3}
                      variant="bordered"
                    />
                  </div>
                );

              case 'single_choice': {
                const selected = typeof answers[q.id] === 'string' && answers[q.id] ? new Set([answers[q.id] as string]) : new Set<string>();
                return (
                  <div key={q.id} className="space-y-2 rounded-xl border border-default-200 p-3">
                    <div className="text-sm font-medium text-default-700">
                      {q.title}{q.required ? ' *' : ''}
                    </div>
                    {q.description ? <div className="text-xs text-default-500">{q.description}</div> : null}
                    <Select
                      selectedKeys={selected}
                      onSelectionChange={(keys) => {
                        const arr = keys === 'all' ? (q.options || []).map((o) => o.id) : Array.from(keys as Set<string>);
                        setAnswers((prev) => ({ ...prev, [q.id]: arr.length ? arr[0] : '' }));
                      }}
                      variant="bordered"
                      placeholder="Select one"
                      items={q.options || []}
                    >
                      {(opt: AnswerOption) => <SelectItem key={opt.id}>{opt.text}</SelectItem>}
                    </Select>
                  </div>
                );
              }

              case 'multiple_choice': {
                const selected = Array.isArray(answers[q.id]) ? new Set(answers[q.id] as string[]) : new Set<string>();
                return (
                  <div key={q.id} className="space-y-2 rounded-xl border border-default-200 p-3">
                    <div className="text-sm font-medium text-default-700">
                      {q.title}{q.required ? ' *' : ''}
                    </div>
                    {q.description ? <div className="text-xs text-default-500">{q.description}</div> : null}
                    <Select
                      selectionMode="multiple"
                      selectedKeys={selected}
                      onSelectionChange={(keys) => {
                        const arr = keys === 'all' ? (q.options || []).map((o) => o.id) : Array.from(keys as Set<string>);
                        setAnswers((prev) => ({ ...prev, [q.id]: arr }));
                      }}
                      variant="bordered"
                      placeholder="Select one or more"
                      items={q.options || []}
                    >
                      {(opt: AnswerOption) => <SelectItem key={opt.id}>{opt.text}</SelectItem>}
                    </Select>
                  </div>
                );
              }

              case 'rating': {
                const opts = ratingOptions(q);
                const raw = answers[q.id];
                const selectedKey = typeof raw === 'number' ? String(raw) : (raw as string) || '';
                const selected = selectedKey ? new Set([selectedKey]) : new Set<string>();
                return (
                  <div key={q.id} className="space-y-2 rounded-xl border border-default-200 p-3">
                    <div className="text-sm font-medium text-default-700">
                      {q.title}{q.required ? ' *' : ''}
                    </div>
                    {q.description ? <div className="text-xs text-default-500">{q.description}</div> : null}
                    <Select
                      selectedKeys={selected}
                      onSelectionChange={(keys) => {
                        const arr = keys === 'all' ? opts.map((o) => o.id) : Array.from(keys as Set<string>);
                        const key = arr[0] || '';
                        const opt = opts.find((o) => o.id === key);
                        const val = typeof opt?.value === 'number' ? opt.value : Number(key);
                        setAnswers((prev) => ({ ...prev, [q.id]: val }));
                      }}
                      variant="bordered"
                      placeholder="Select a rating"
                      items={opts}
                    >
                      {(opt: AnswerOption) => <SelectItem key={opt.id}>{opt.text}</SelectItem>}
                    </Select>
                  </div>
                );
              }

              case 'boolean': {
                const val = typeof answers[q.id] === 'boolean' ? (answers[q.id] as boolean) : false;
                return (
                  <div key={q.id} className="space-y-2 rounded-xl border border-default-200 p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-default-700">
                        {q.title}{q.required ? ' *' : ''}
                      </div>
                      <Switch
                        isSelected={val}
                        onValueChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                      />
                    </div>
                    {q.description ? <div className="text-xs text-default-500">{q.description}</div> : null}
                  </div>
                );
              }
            }
          })
        )}
      </CardBody>

      <CardFooter className="justify-end gap-2">
        <Button variant="light">Save draft</Button>
        <Button color="primary" isDisabled={!requiredOk} onPress={handleSubmit}>
          Submit feedback
        </Button>
      </CardFooter>
    </Card>
  );
}
