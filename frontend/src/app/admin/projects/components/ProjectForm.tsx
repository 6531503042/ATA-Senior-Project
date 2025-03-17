'use client';

import React from 'react';
import { DatePicker } from '@/components/shared/date-picker';
import { TeamSelector } from '@/components/shared/team-selector';
import { Project } from '../models/types';
import { User } from '@/types/auth';
import '../styles/ProjectForm.css';

interface ProjectFormProps {
  project?: Project;
  users: User[];
  onSubmit: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

export function ProjectForm({ project, users, onSubmit, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = React.useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>({
    name: project?.name ?? '',
    description: project?.description ?? '',
    memberIds: project?.memberIds || [],
    projectStartDate: project?.projectStartDate ?? new Date().toISOString(),
    projectEndDate: project?.projectEndDate ?? new Date().toISOString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <div className="form-group">
        <label htmlFor="name">Project Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
          disabled={isLoading}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <DatePicker
            label="Start Date"
            date={new Date(formData.projectStartDate)}
            setDate={(date) => handleChange('projectStartDate', date?.toISOString() ?? new Date().toISOString())}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <DatePicker
            label="End Date"
            date={new Date(formData.projectEndDate)}
            setDate={(date) => handleChange('projectEndDate', date?.toISOString() ?? new Date().toISOString())}
            minDate={new Date(formData.projectStartDate)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-group">
        <TeamSelector
          users={users}
          selectedMembers={formData.memberIds.map((userId) => ({
            id: userId.toString(),
            userId,
          }))}
          onAddMember={() => {
            handleChange('memberIds', [...formData.memberIds]);
          }}
          onRemoveMember={(id) => {
            handleChange(
              'memberIds',
              formData.memberIds.filter((userId) => userId.toString() !== id)
            );
          }}
          onMemberSelect={(id, userId) => {
            handleChange(
              'memberIds',
              formData.memberIds.map((memberId) =>
                memberId.toString() === id ? userId : memberId
              )
            );
          }}
          disabled={isLoading}
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
} 