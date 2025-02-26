'use client';

import React, { useState, useEffect } from 'react';
import { FolderPlus, X, Rocket, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { TeamSelector } from '@/components/shared/team-selector';
import { createProject, updateProjectMembers } from '@/lib/api/projects';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import api from '@/utils/api';
import type { User } from '@/types/auth';

interface CreateProjectFormProps {
  onClose: () => void;
}

interface TeamMember {
  id: string;
  userId: number;
}

export function CreateProjectForm({ onClose }: CreateProjectFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectStartDate: '',
    projectEndDate: '',
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
      const fetchUsers = async () => {
        try {
          setIsLoading(true);
          const response = await api.get('/manager/list');
          console.log('Fetched users:', response.data);
          setUsers(response.data);
        } catch (error) {
          console.error('Failed to fetch users:', error);
          toast({
            title: 'Error',
            description: 'Failed to load team members. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchUsers();
    }, [toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: 'projectStartDate' | 'projectEndDate', date: Date | undefined) => {
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Don't allow past dates
      if (date < today) {
        toast({
          title: 'Invalid Date',
          description: 'Please select a date in the future.',
          variant: 'destructive',
        });
        return;
      }

      // For end date, ensure it's after start date
      if (field === 'projectEndDate' && formData.projectStartDate) {
        const startDate = new Date(formData.projectStartDate);
        if (date < startDate) {
          toast({
            title: 'Invalid Date',
            description: 'End date must be after start date.',
            variant: 'destructive',
          });
          return;
        }
      }

      // For start date, if there's an end date, ensure it's before end date
      if (field === 'projectStartDate' && formData.projectEndDate) {
        const endDate = new Date(formData.projectEndDate);
        if (date > endDate) {
          setFormData(prev => ({
            ...prev,
            [field]: date.toISOString(),
            projectEndDate: '' // Clear end date if start date is after it
          }));
          return;
        }
      }

      setFormData(prev => ({ ...prev, [field]: date.toISOString() }));
    }
  };

  const handleAddMember = () => {
    setTeamMembers((prev) => [...prev, { id: crypto.randomUUID(), userId: 0 }]);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const handleMemberSelect = (id: string, userId: number) => {
    setTeamMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, userId } : member))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create project first
      const projectResponse = await createProject(formData);
      
      // Only add members if there are any selected
      if (teamMembers.length > 0) {
        const validMembers = teamMembers.filter(member => member.userId !== 0);
        if (validMembers.length > 0) {
          try {
            await updateProjectMembers(
              projectResponse.id,
              validMembers.map((member) => member.userId)
            );
          } catch (memberError) {
            console.error('Failed to add team members:', memberError);
            toast({
              title: 'Warning',
              description: 'Project created but failed to add team members.',
              variant: 'destructive',
            });
          }
        }
      }

      toast({
        title: 'Success',
        description: 'Project created successfully.',
      });
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-3xl mx-auto animate-in fade-in zoom-in duration-200">
          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="space-y-1 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-violet-50 rounded-lg">
                    <FolderPlus className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
                    <p className="text-sm text-gray-500">Fill in the details to create a new project</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="Enter project name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="Enter project description"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal mt-1',
                              !formData.projectStartDate && 'text-gray-400'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.projectStartDate ? (
                              format(new Date(formData.projectStartDate), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.projectStartDate ? new Date(formData.projectStartDate) : undefined}
                            onSelect={(date: Date | undefined) => handleDateChange('projectStartDate', date)}
                            disabled={{ before: new Date() }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal mt-1',
                              !formData.projectEndDate && 'text-gray-400'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.projectEndDate ? (
                              format(new Date(formData.projectEndDate), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.projectEndDate ? new Date(formData.projectEndDate) : undefined}
                            onSelect={(date: Date | undefined) => handleDateChange('projectEndDate', date)}
                            disabled={{ 
                              before: formData.projectStartDate ? new Date(formData.projectStartDate) : new Date()
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <TeamSelector
                      users={users}
                      selectedMembers={teamMembers}
                      onAddMember={handleAddMember}
                      onRemoveMember={handleRemoveMember}
                      onMemberSelect={handleMemberSelect}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2 p-6 pt-0">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                isLoading={isLoading}
                leftIcon={<Rocket className="h-4 w-4" />}
              >
                Create Project
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 