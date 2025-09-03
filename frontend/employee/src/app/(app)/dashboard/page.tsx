'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
} from '@heroui/react';
import { CalendarDays, CheckCircle2, Clock } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

type Status = 'not_done' | 'done';

const mock: Array<{ id: number; name: string; duration: string; status: Status }> = [
  { id: 101, name: 'Sprint 12 Feedback', duration: 'Aug 1 – Aug 15, 2025', status: 'not_done' },
  { id: 102, name: 'Quarterly Survey', duration: 'Jul 1 – Jul 31, 2025', status: 'done' },
];

export default function EmployeeDashboard() {
  const router = useRouter();

  // Employees can see only pending (not_done)
  const visible = mock.filter(f => f.status !== 'done');

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
        <p className="text-default-600 mt-2">Your assigned feedback forms</p>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-default-600">
          🎉 No pending forms right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {visible.map(f => (
            <Card
              key={f.id}
              isPressable
              onPress={() => router.push(`/feedback/${f.id}`)}
              className="group relative overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all rounded-2xl"
            >
              {/* Decorative gradient bar on top */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />

              <CardHeader className="flex flex-col items-start gap-2 pt-6">
                <h3 className="text-lg font-semibold group-hover:text-violet-700 transition-colors">
                  {f.name}
                </h3>
                <div className="flex items-center text-sm text-default-600 gap-2">
                  <CalendarDays className="w-4 h-4" />
                  {f.duration}
                </div>
              </CardHeader>

              <CardBody className="pt-2 w-max">
                <Chip
                  variant="flat"
                  startContent={<Clock className="w-4 h-4 text-red-600" />}
                  className="font-medium px-2 bg-red-50 text-red-700 border border-red-200"
                >
                  Pending
                </Chip>
              </CardBody>

              <CardFooter className="justify-end pb-6">
                <Button
                  as={Link}
                  href={`/feedback/${f.id}`}
                  onClick={e => e.stopPropagation()}
                  className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                >
                  Start
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
