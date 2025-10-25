'use client';
import { Card, CardBody } from '@heroui/react';
import React from 'react';

export default function MyProjects({ projects }: { projects: any[] }) {
  return (
    <Card className="bg-white  shadow">
      <CardBody className="p-6 space-y-3">
        <h3 className="text-lg font-bold text-gray-900 ">My Projects</h3>
        {projects?.length ? projects.map(p => (
          <div key={p.id} className="p-3 border rounded bg-gray-50 ">
            <p className="font-medium text-gray-800 ">{p.name}</p>
            <p className="text-sm text-gray-600 ">{p.description}</p>
          </div>
        )) : <p className="text-gray-600 ">No projects assigned</p>}
      </CardBody>
    </Card>
  );
}
