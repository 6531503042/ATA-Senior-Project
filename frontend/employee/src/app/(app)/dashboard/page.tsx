'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from '@heroui/react';
import React from 'react';

const mock = [
  { id: 101, name: 'Sprint 12 Feedback', duration: 'Aug 1 – Aug 15, 2025', status: 'not_done' as const },
  { id: 102, name: 'Quarterly Survey', duration: 'Jul 1 – Jul 31, 2025', status: 'done' as const },
];

export default function EmployeeDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
        <p className="text-default-600 mt-2">Your assigned feedback forms</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mock.map((f) => (
          <Card
            key={f.id}
            isPressable
            onPress={() => router.push(`/feedback/${f.id}`)}
            className="border-0 shadow-md hover:shadow-xl transition hover:-translate-y-0.5"
          >
            <CardHeader className="flex flex-col items-start gap-1">
              <h3 className="text-lg font-semibold">{f.name}</h3>
              <div className="text-sm text-default-600">{f.duration}</div>
            </CardHeader>
            <CardBody>
              <Chip color={f.status === 'done' ? 'success' : 'warning'} variant="flat">
                {f.status === 'done' ? 'Completed' : 'Pending'}
              </Chip>
            </CardBody>
            <CardFooter className="justify-end">
              <Button size="sm" onPress={(e) => { e.stopPropagation(); router.push(`/feedback/${f.id}`); }}>
                {f.status === 'done' ? 'View' : 'Start'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
