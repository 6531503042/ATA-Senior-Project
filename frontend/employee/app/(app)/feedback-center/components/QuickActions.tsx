'use client';
import { Button, Card, CardBody } from '@heroui/react';
import { MessageSquare, CheckCircle, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function QuickActions() {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow">
      <CardBody className="p-6 space-y-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h3>
        <Button as={Link} href="/feedback-center" variant="flat"
          className="w-full justify-start bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300">
          <MessageSquare className="w-4 h-4 mr-2" /> View All Feedbacks
        </Button>
        <Button variant="flat"
          className="w-full justify-start bg-green-50 dark:bg-slate-800 text-green-700 dark:text-green-300">
          <CheckCircle className="w-4 h-4 mr-2" /> My Submissions
        </Button>
        <Button variant="flat"
          className="w-full justify-start bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-300">
          <Users className="w-4 h-4 mr-2" /> My Projects
        </Button>
      </CardBody>
    </Card>
  );
}
