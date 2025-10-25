'use client';
import { Card, CardBody } from '@heroui/react';
import React from 'react';

export default function RecentActivity() {
  return (
    <Card className="bg-white  shadow">
      <CardBody className="p-6 space-y-3">
        <h3 className="text-lg font-bold text-gray-900 ">Recent Activity</h3>
        <div className="p-3 bg-gray-50  rounded">
          <p className="text-sm text-gray-800 ">Logged in</p>
          <p className="text-xs text-gray-500 ">Just now</p>
        </div>
      </CardBody>
    </Card>
  );
}
