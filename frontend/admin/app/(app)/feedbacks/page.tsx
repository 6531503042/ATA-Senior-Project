'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar,
  Input,
  Select,
  SelectItem,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  MessageSquare,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  Star,
} from 'lucide-react';

import { PageHeader } from '../../../components/ui/page-header';
import { CardStat } from '../../../components/ui/card-stat';

import { api } from '../../../libs/apiClient';

interface Feedback {
  id: number;
  title: string;
  description: string;
  projectTitle: string;
  submitterName: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
  rating?: number;
  responsesCount: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
}

interface ApiResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null,
  );
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    activeFeedbacks: 0,
    completedFeedbacks: 0,
    pendingFeedbacks: 0,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadFeedbacks();
    loadProjects();
  }, [page, searchTerm, statusFilter, projectFilter]);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const params = {
        page: page - 1,
        size: 10,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        projectId: projectFilter !== 'all' ? projectFilter : undefined,
      };

      const response = await api.get<ApiResponse<Feedback>>('/api/feedbacks', params);
      console.log('Feedbacks API response:', response);
      
      // Handle different response formats
      let feedbacksList: Feedback[] = [];
      if (response?.content && Array.isArray(response.content)) {
        feedbacksList = response.content;
      } else if (Array.isArray(response)) {
        feedbacksList = response;
      } else if (response?.feedbacks && Array.isArray(response.feedbacks)) {
        feedbacksList = response.feedbacks;
      }
      
      setFeedbacks(feedbacksList);
      setTotalPages(response?.totalPages || 1);
      
      // Calculate stats
      const totalFeedbacks = feedbacksList.length;
      const activeFeedbacks = feedbacksList.filter(f => f.status === 'ACTIVE').length;
      const completedFeedbacks = feedbacksList.filter(f => f.status === 'COMPLETED').length;
      const pendingFeedbacks = feedbacksList.filter(f => f.status === 'PENDING').length;
      
      setStats({
        totalFeedbacks,
        activeFeedbacks,
        completedFeedbacks,
        pendingFeedbacks,
      });
      
      setError(null);
    } catch (err) {
      console.error('Error loading feedbacks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load feedbacks');
      setFeedbacks([]);
      setStats({
        totalFeedbacks: 0,
        activeFeedbacks: 0,
        completedFeedbacks: 0,
        pendingFeedbacks: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await api.get<ApiResponse<Project>>('/api/projects', {
        page: 0,
        size: 100,
      });

      setProjects(response.content || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleStatusChange = async (feedbackId: number, newStatus: string) => {
    try {
      await api.patch(`/api/feedbacks/${feedbackId}/status`, {
        status: newStatus,
      });
      loadFeedbacks();
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (feedbackId: number) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await api.delete(`/api/feedbacks/${feedbackId}`);
      loadFeedbacks();
    } catch (err: any) {
      setError(err.message || 'Failed to delete feedback');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'primary';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch =
      feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.submitterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || feedback.status === statusFilter;
    const matchesProject =
      projectFilter === 'all' || feedback.projectTitle === projectFilter;

    return matchesSearch && matchesStatus && matchesProject;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
             <PageHeader
         title="Feedbacks Management"
         description="Manage and monitor all feedback submissions"
         action={
           <Button
             color="primary"
             startContent={<Plus size={16} />}
             onPress={onOpen}
           >
             Create Feedback
           </Button>
         }
       />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <CardStat
           title="Total Feedbacks"
           value={stats.totalFeedbacks}
           icon={<MessageSquare className="w-5 h-5 text-blue-600" />}
         />
         <CardStat
           title="Active"
           value={stats.activeFeedbacks}
           icon={<CheckCircle className="w-5 h-5 text-green-600" />}
         />
         <CardStat
           title="Completed"
           value={stats.completedFeedbacks}
           icon={<Star className="w-5 h-5 text-purple-600" />}
         />
         <CardStat
           title="Pending"
           value={stats.pendingFeedbacks}
           icon={<Clock className="w-5 h-5 text-yellow-600" />}
         />
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              className="flex-1"
              placeholder="Search feedbacks..."
              startContent={<Search size={16} />}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Select
              className="w-full md:w-48"
              placeholder="Status"
              selectedKeys={[statusFilter]}
              startContent={<Filter size={16} />}
              onSelectionChange={keys =>
                setStatusFilter(Array.from(keys)[0] as string)
              }
            >
              <SelectItem key="all">All Status</SelectItem>
              <SelectItem key="ACTIVE">Active</SelectItem>
              <SelectItem key="COMPLETED">Completed</SelectItem>
              <SelectItem key="PENDING">Pending</SelectItem>
            </Select>
            <Select
              className="w-full md:w-48"
              placeholder="Project"
              selectedKeys={[projectFilter]}
              startContent={<FileText size={16} />}
              onSelectionChange={keys =>
                setProjectFilter(Array.from(keys)[0] as string)
              }
            >
              <SelectItem key="all">All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.title}>{project.title}</SelectItem>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Feedbacks Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Feedbacks List</h3>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-gray-600 mt-2">Loading feedbacks...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <Button className="mt-2" color="primary" onPress={loadFeedbacks}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              <Table aria-label="Feedbacks table">
                <TableHeader>
                  <TableColumn>FEEDBACK</TableColumn>
                  <TableColumn>PROJECT</TableColumn>
                  <TableColumn>SUBMITTER</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>RESPONSES</TableColumn>
                  <TableColumn>CREATED</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredFeedbacks.map(feedback => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{feedback.title}</p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {feedback.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="text-gray-400" size={16} />
                          <span className="text-sm">
                            {feedback.projectTitle}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar name={feedback.submitterName} size="sm" />
                          <span className="text-sm">
                            {feedback.submitterName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={getStatusColor(feedback.status) as any}
                          size="sm"
                          variant="flat"
                        >
                          {feedback.status}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="text-gray-400" size={14} />
                          <span className="text-sm">
                            {feedback.responsesCount}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="text-gray-400" size={14} />
                          <span className="text-sm">
                            {formatDate(feedback.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            color="primary"
                            size="sm"
                            startContent={<Eye size={14} />}
                            variant="flat"
                            onPress={() => {
                              setSelectedFeedback(feedback);
                              onOpen();
                            }}
                          >
                            View
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            startContent={<Trash2 size={14} />}
                            variant="flat"
                            onPress={() => handleDelete(feedback.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredFeedbacks.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">No feedbacks found</p>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            showControls
            color="primary"
            page={page}
            total={totalPages}
            onChange={setPage}
          />
        </div>
      )}

      {/* Feedback Detail Modal */}
      <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {selectedFeedback ? 'Feedback Details' : 'Create New Feedback'}
          </ModalHeader>
          <ModalBody>
            {selectedFeedback ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="feedback-title" className="text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <p id="feedback-title" className="text-gray-900">{selectedFeedback.title}</p>
                </div>
                <div>
                  <label htmlFor="feedback-description" className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <p id="feedback-description" className="text-gray-900">
                    {selectedFeedback.description}
                  </p>
                </div>
                <div>
                  <label htmlFor="feedback-project" className="text-sm font-medium text-gray-700">
                    Project
                  </label>
                  <p id="feedback-project" className="text-gray-900">
                    {selectedFeedback.projectTitle}
                  </p>
                </div>
                <div>
                  <label htmlFor="feedback-submitter" className="text-sm font-medium text-gray-700">
                    Submitter
                  </label>
                  <p id="feedback-submitter" className="text-gray-900">
                    {selectedFeedback.submitterName}
                  </p>
                </div>
                <div>
                  <label htmlFor="feedback-status" className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <Select
                    id="feedback-status"
                    selectedKeys={[selectedFeedback.status]}
                    onSelectionChange={keys => {
                      const newStatus = Array.from(keys)[0] as string;

                      handleStatusChange(selectedFeedback.id, newStatus);
                    }}
                  >
                    <SelectItem key="ACTIVE">Active</SelectItem>
                    <SelectItem key="COMPLETED">Completed</SelectItem>
                    <SelectItem key="PENDING">Pending</SelectItem>
                  </Select>
                </div>
                {selectedFeedback.rating && (
                  <div>
                    <label htmlFor="feedback-rating" className="text-sm font-medium text-gray-700">
                      Rating
                    </label>
                    <p id="feedback-rating" className="text-gray-900">{selectedFeedback.rating}/5</p>
                  </div>
                )}
                <div>
                  <label htmlFor="feedback-created" className="text-sm font-medium text-gray-700">
                    Created
                  </label>
                  <p id="feedback-created" className="text-gray-900">
                    {formatDate(selectedFeedback.createdAt)}
                  </p>
                </div>
                <div>
                  <label htmlFor="feedback-updated" className="text-sm font-medium text-gray-700">
                    Updated
                  </label>
                  <p id="feedback-updated" className="text-gray-900">
                    {formatDate(selectedFeedback.updatedAt)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Input label="Title" placeholder="Enter feedback title" />
                <Textarea
                  label="Description"
                  placeholder="Enter feedback description"
                  rows={4}
                />
                <Select label="Project" placeholder="Select project">
                  {projects.map(project => (
                    <SelectItem key={project.id}>{project.title}</SelectItem>
                  ))}
                </Select>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Close
            </Button>
            {!selectedFeedback && (
              <Button color="primary">Create Feedback</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
