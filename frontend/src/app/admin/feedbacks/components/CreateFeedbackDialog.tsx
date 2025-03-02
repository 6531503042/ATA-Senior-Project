'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Rocket } from 'lucide-react';
import FormHeader from './FormHeader';
import FormBody from './FormBody';
import { createFeedback } from '@/lib/api/feedbacks';
import { getAllQuestions } from '@/lib/api/questions';
import { getProjects } from '@/lib/api/projects';
import type { Project } from '../../projects/models/types';
import type { Question } from '../../questions/models/types';

interface CreateFeedbackDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export function CreateFeedbackDialog({ isOpen, setIsOpen, onSuccess }: CreateFeedbackDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, questionsData] = await Promise.all([
          getProjects(),
          getAllQuestions()
        ]);
        setProjects(projectsData);
        setQuestions(questionsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load required data. Please try again.',
          variant: 'destructive',
        });
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!selectedProject) {
      newErrors.project = 'Please select a project';
    }
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    if (selectedQuestions.length === 0) {
      newErrors.questions = 'Please select at least one question';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createFeedback({
        title,
        description,
        projectId: selectedProject,
        questionIds: selectedQuestions,
        startDate: startDate!.toISOString(),
        endDate: dueDate!.toISOString(),
      });

      toast({
        title: 'Success',
        description: 'Feedback form created successfully.',
      });
      
      onSuccess();
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to create feedback form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate(undefined);
    setDueDate(undefined);
    setSelectedProject(0);
    setSelectedQuestions([]);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-3xl mx-auto animate-in fade-in zoom-in duration-200">
          <Card className="bg-white shadow-xl border-0">
            <FormHeader setIsOpen={setIsOpen} />
            
            <div className="p-6">
              <FormBody
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                startDate={startDate}
                setStartDate={setStartDate}
                dueDate={dueDate}
                setDueDate={setDueDate}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                selectedQuestions={selectedQuestions}
                setSelectedQuestions={setSelectedQuestions}
                projects={projects}
                questions={questions}
                errors={errors}
              />
            </div>

            <div className="flex justify-end space-x-2 p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                isLoading={isLoading}
                leftIcon={<Rocket className="h-4 w-4" />}
              >
                Create Feedback
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 