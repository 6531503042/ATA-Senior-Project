"use client";

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
  useDisclosure
} from '@heroui/react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MessageSquare,
  Calendar,
  User,
  FileText
} from 'lucide-react';
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
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  
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
      setFeedbacks(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await api.get<ApiResponse<Project>>('/api/projects', { page: 0, size: 100 });
      setProjects(response.content || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleStatusChange = async (feedbackId: number, newStatus: string) => {
    try {
      await api.patch(`/api/feedbacks/${feedbackId}/status`, { status: newStatus });
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
      case 'ACTIVE': return 'success';
      case 'COMPLETED': return 'primary';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.submitterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    const matchesProject = projectFilter === 'all' || feedback.projectTitle === projectFilter;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feedbacks Management</h1>
          <p className="text-gray-600">Manage and monitor all feedback submissions</p>
        </div>
        <Button 
          color="primary" 
          startContent={<Plus size={16} />}
          onPress={onOpen}
        >
          Create Feedback
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Feedbacks</p>
                <p className="text-lg font-semibold">{feedbacks.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-lg font-semibold">
                  {feedbacks.filter(f => f.status === 'ACTIVE').length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-lg font-semibold">
                  {feedbacks.filter(f => f.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <MessageSquare className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-lg font-semibold">
                  {feedbacks.filter(f => f.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search feedbacks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Search size={16} />}
              className="flex-1"
            />
            <Select
              placeholder="Status"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
              startContent={<Filter size={16} />}
              className="w-full md:w-48"
            >
              <SelectItem key="all">All Status</SelectItem>
              <SelectItem key="ACTIVE">Active</SelectItem>
              <SelectItem key="COMPLETED">Completed</SelectItem>
              <SelectItem key="PENDING">Pending</SelectItem>
            </Select>
            <Select
              placeholder="Project"
              selectedKeys={[projectFilter]}
              onSelectionChange={(keys) => setProjectFilter(Array.from(keys)[0] as string)}
              startContent={<FileText size={16} />}
              className="w-full md:w-48"
            >
              <SelectItem key="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.title}>
                  {project.title}
                </SelectItem>
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading feedbacks...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <Button color="primary" className="mt-2" onPress={loadFeedbacks}>
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
                  {filteredFeedbacks.map((feedback) => (
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
                          <FileText size={16} className="text-gray-400" />
                          <span className="text-sm">{feedback.projectTitle}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar name={feedback.submitterName} size="sm" />
                          <span className="text-sm">{feedback.submitterName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          color={getStatusColor(feedback.status) as any}
                          variant="flat"
                          size="sm"
                        >
                          {feedback.status}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MessageSquare size={14} className="text-gray-400" />
                          <span className="text-sm">{feedback.responsesCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm">{formatDate(feedback.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            startContent={<Eye size={14} />}
                            onPress={() => {
                              setSelectedFeedback(feedback);
                              onOpen();
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            startContent={<Trash2 size={14} />}
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
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
            color="primary"
          />
        </div>
      )}

      {/* Feedback Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {selectedFeedback ? 'Feedback Details' : 'Create New Feedback'}
          </ModalHeader>
          <ModalBody>
            {selectedFeedback ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <p className="text-gray-900">{selectedFeedback.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{selectedFeedback.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Project</label>
                  <p className="text-gray-900">{selectedFeedback.projectTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Submitter</label>
                  <p className="text-gray-900">{selectedFeedback.submitterName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Select
                    selectedKeys={[selectedFeedback.status]}
                    onSelectionChange={(keys) => {
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
                    <label className="text-sm font-medium text-gray-700">Rating</label>
                    <p className="text-gray-900">{selectedFeedback.rating}/5</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Created</label>
                  <p className="text-gray-900">{formatDate(selectedFeedback.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Updated</label>
                  <p className="text-gray-900">{formatDate(selectedFeedback.updatedAt)}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  label="Title"
                  placeholder="Enter feedback title"
                />
                <Textarea
                  label="Description"
                  placeholder="Enter feedback description"
                  rows={4}
                />
                <Select
                  label="Project"
                  placeholder="Select project"
                >
                  {projects.map((project) => (
                    <SelectItem key={project.id}>
                      {project.title}
                    </SelectItem>
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
              <Button color="primary">
                Create Feedback
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
