'use client';

import { Card, CardBody, CardHeader, Chip } from '@heroui/react';
import EmployeeFeedbackForm from './_components/EmployeeFeedbackForm';
import type { Question } from '@/types/questions';

export default function EmployeeDashboardPage() {
  // Mock “assigned” questions (replace with fetch/useSWR later)
  const questions: Question[] = [
    {
      id: 'q1',
      title: 'Overall project satisfaction',
      description: 'Rate your overall satisfaction with the project.',
      type: 'rating',
      category: 'project_satisfaction',
      options: Array.from({ length: 5 }, (_, i) => ({ id: String(i + 1), text: String(i + 1), value: i + 1 })),
      required: true,
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'q2',
      title: 'What went well this sprint?',
      description: 'Share highlights or wins.',
      type: 'text_based',
      category: 'team_collaboration',
      required: true,
      order: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'q3',
      title: 'Primary blocker encountered',
      description: 'Choose the main blocker you faced.',
      type: 'single_choice',
      category: 'work_environment',
      options: [
        { id: 'tools', text: 'Tools/Access' },
        { id: 'communication', text: 'Communication' },
        { id: 'requirements', text: 'Requirements clarity' },
        { id: 'other', text: 'Other' },
      ],
      required: false,
      order: 3,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'q4',
      title: 'Areas to improve (choose any)',
      description: 'Select all that apply.',
      type: 'multiple_choice',
      category: 'technical_skills',
      options: [
        { id: 'testing', text: 'Automated testing' },
        { id: 'docs', text: 'Documentation' },
        { id: 'devops', text: 'DevOps/CI' },
        { id: 'ux', text: 'UX polish' },
      ],
      required: false,
      order: 4,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'q5',
      title: 'Would you recommend this process change?',
      type: 'boolean',
      category: 'work_environment',
      required: false,
      order: 5,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const projectName = 'ATA IT Feedback System'; // replace with employee’s assigned project/group

  return (
    <div className="space-y-6">
      {/* Top “Welcome” card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
        <CardHeader>
          <div>
            <h1 className="text-2xl font-bold text-default-900">Welcome back 👋</h1>
            <p className="text-default-600">Please complete the assigned feedback form for this cycle.</p>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Chip size="sm" variant="flat" color="secondary">Employee</Chip>
            <Chip size="sm" variant="flat">Project: {projectName}</Chip>
          </div>
        </CardBody>
      </Card>

      {/* Assigned form */}
      <EmployeeFeedbackForm
        projectName={projectName}
        questions={questions}
        onSubmit={(payload) => {
          // Wire this to your POST /feedback endpoint later
          console.log('Employee form submitted:', payload);
        }}
      />
    </div>
  );
}
