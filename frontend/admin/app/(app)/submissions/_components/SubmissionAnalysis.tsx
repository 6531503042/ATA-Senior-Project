'use client';

import {
  Card,
  CardHeader,
  CardBody,
  Chip,
  Progress,
  Divider,
} from '@heroui/react';
import { Brain, TrendingUp, Users } from 'lucide-react';

type Props = {
  summary?: string;
};

export default function SubmissionAnalysis({
  summary = 'AI-powered insights summary (mock)',
}: Props) {
  return (
    <Card
      className="bg-white/90 dark:bg-default-50/90 backdrop-blur"
      shadow="sm"
    >
      <CardHeader className="flex items-center gap-3 pb-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
          <Brain className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold">Analysis Summary</h3>
          <p className="text-default-500 text-xs">Auto-generated overview</p>
        </div>
      </CardHeader>
      <Divider className="opacity-70" />
      <CardBody className="space-y-5 pt-4">
        <p className="text-default-600 text-sm leading-relaxed">{summary}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Metric
            icon={<Users className="w-4 h-4" />}
            label="Engagement"
            value={74}
          />
          <Metric
            icon={<TrendingUp className="w-4 h-4" />}
            label="Performance"
            value={82}
          />
          <Metric
            icon={<Brain className="w-4 h-4" />}
            label="Consistency"
            value={68}
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Highlights</h4>
          <ul className="text-sm text-default-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-500" />{' '}
              Positive sentiment increasing week-over-week.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />{' '}
              Response rate remains stable above 85%.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />{' '}
              Action items identified for onboarding questions.
            </li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-default-600 flex items-center gap-2">
          {icon}
          {label}
        </span>
        <Chip
          color={value >= 80 ? 'success' : value >= 60 ? 'primary' : 'warning'}
          size="sm"
          variant="flat"
        >
          {value}%
        </Chip>
      </div>
      <Progress aria-label={label} className="h-2" value={value} />
    </div>
  );
}
