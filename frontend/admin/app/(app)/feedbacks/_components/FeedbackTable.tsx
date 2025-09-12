'use client';

import type { Feedback } from '@/types/feedback';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
  SortDescriptor,
} from '@heroui/react';
import { MoreVertical, Eye, Edit, Trash2, MessageSquare, Calendar, FileText, Users, Clock, Building } from 'lucide-react';
import { Key, useCallback, useMemo, useState } from 'react';

import TopContent from './TopContent';
import BottomContent from './BottomContent';

interface FeedbackTableProps {
  feedbacks: Feedback[];
  onView: (feedback: Feedback) => void;
  onEdit: (feedback: Feedback) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  onRefresh?: () => void;
}

export default function FeedbackTable({
  feedbacks,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onRefresh,
}: FeedbackTableProps) {
  const [filterValue, setFilterValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'createdAt',
    direction: 'descending',
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const filteredItems = useMemo(() => {
    let filteredFeedbacks = [...feedbacks];

    if (filterValue) {
      filteredFeedbacks = filteredFeedbacks.filter(feedback =>
        feedback.title.toLowerCase().includes(filterValue.toLowerCase()) ||
        feedback.description.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (selectedStatus.length > 0) {
      filteredFeedbacks = filteredFeedbacks.filter(feedback =>
        selectedStatus.includes(feedback.status.toLowerCase())
      );
    }

    return filteredFeedbacks;
  }, [feedbacks, filterValue, selectedStatus]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Feedback] as number;
      const second = b[sortDescriptor.column as keyof Feedback] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  const pages = Math.ceil(sortedItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const onSortChange = useCallback((descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  }, []);

  const handleClear = useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const topContent = useMemo(
    () => (
      <TopContent
        filterValue={filterValue}
        onClear={handleClear}
        onSearchChange={handleSearch}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onRefresh={onRefresh || (() => {})}
      />
    ),
    [filterValue, selectedStatus, onRefresh, handleClear, handleSearch],
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'primary';
      case 'PENDING':
        return 'warning';
      case 'DRAFT':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return {
          bg: 'bg-green-100 dark:bg-green-900/20',
          text: 'text-green-700 dark:text-green-400',
          dot: 'bg-green-500',
          label: 'Active',
        };
      case 'COMPLETED':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/20',
          text: 'text-blue-700 dark:text-blue-400',
          dot: 'bg-blue-500',
          label: 'Completed',
        };
      case 'PENDING':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/20',
          text: 'text-amber-700 dark:text-amber-400',
          dot: 'bg-amber-500',
          label: 'Pending',
        };
      case 'DRAFT':
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          dot: 'bg-gray-400',
          label: 'Draft',
        };
    }
  };

  const getVisibilityStatus = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return { status: 'NOT_SET', text: 'Not set', color: 'default' };
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return { status: 'PENDING', text: 'Not visible yet', color: 'warning' };
    if (now > end) return { status: 'EXPIRED', text: 'Expired', color: 'danger' };
    return { status: 'ACTIVE', text: 'Currently visible', color: 'success' };
  };

  const getScopeText = (feedback: Feedback) => {
    if (feedback.isDepartmentWide && feedback.departmentName) {
      return `Department: ${feedback.departmentName}`;
    }
    if (feedback.projectName) {
      return `Project: ${feedback.projectName}`;
    }
    return 'Custom scope';
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

  const renderCell = (feedback: Feedback, columnKey: React.Key) => {
    switch (columnKey) {
      case 'feedback':
        return (
          <div className="flex flex-col gap-2 py-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-gray-900 text-sm">{feedback.title}</p>
                <p className="text-xs text-gray-500 truncate max-w-xs">
                  {feedback.description}
                </p>
              </div>
            </div>
          </div>
        );
      case 'scope':
        return (
          <div className="flex items-center gap-2 py-2">
            <div className="p-1.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-md">
              <Building className="w-3 h-3 text-purple-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">{getScopeText(feedback)}</span>
              <span className="text-xs text-gray-500">
                {feedback.isDepartmentWide ? 'Department-wide' : 'Project-specific'}
              </span>
            </div>
          </div>
        );
      case 'visibility':
        const visibilityStatus = getVisibilityStatus(feedback.startDate, feedback.endDate);
        return (
          <div className="flex items-center gap-2 py-2">
            <div className="p-1.5 bg-gradient-to-br from-green-100 to-teal-100 rounded-md">
              <Clock className="w-3 h-3 text-green-600" />
            </div>
            <div className="flex items-center gap-2">
              <Chip
                color={visibilityStatus.color as any}
                size="sm"
                variant="flat"
                radius="full"
                className="text-[11px] h-6 px-2 whitespace-nowrap"
              >
                {visibilityStatus.text}
              </Chip>
              <span className="text-xs text-gray-500">
                {feedback.startDate ? formatDate(feedback.startDate) : 'Not set'}
              </span>
            </div>
          </div>
        );
      case 'questions':
        return (
          <div className="flex items-center gap-2 py-2">
            <div className="p-1.5 bg-gradient-to-br from-orange-100 to-red-100 rounded-md">
              <FileText className="w-3 h-3 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-700">
                {feedback.questionIds?.length || 0}
              </span>
              <span className="text-xs text-gray-500">questions</span>
            </div>
          </div>
        );
      case 'submissions':
        return (
          <div className="flex items-center gap-2 py-2">
            <div className="p-1.5 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-md">
              <Users className="w-3 h-3 text-cyan-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-700">
                {feedback.submissionCount || 0}
              </span>
              <span className="text-xs text-gray-500">responses</span>
            </div>
          </div>
        );
      case 'status':
        const s = getStatusBadgeStyle(feedback.status);
        return (
          <div className="py-2 flex justify-center">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 h-6 text-[11px] font-medium ${s.bg} ${s.text}`}>
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          </div>
        );
      case 'created':
        return (
          <div className="flex items-center gap-2 py-2">
            <div className="p-1.5 bg-gradient-to-br from-gray-100 to-slate-100 rounded-md">
              <Calendar className="w-3 h-3 text-gray-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-700">{formatDate(feedback.createdAt)}</span>
              <span className="text-xs text-gray-500">
                {feedback.allowAnonymous ? 'Anonymous allowed' : 'Named only'}
              </span>
            </div>
          </div>
        );
      case 'actions':
        return (
          <div className="py-2">
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light"
                  className="hover:bg-gray-100 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Feedback actions">
                <DropdownItem
                  key="view"
                  startContent={<Eye className="w-4 h-4" />}
                  onPress={() => onView(feedback)}
                  className="text-blue-600"
                >
                  View Details
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  startContent={<Edit className="w-4 h-4" />}
                  onPress={() => onEdit(feedback)}
                  className="text-green-600"
                >
                  Edit Survey
                </DropdownItem>
                <DropdownItem
                  key="status"
                  startContent={<span className={`inline-flex h-2 w-2 rounded-full ${getStatusBadgeStyle(feedback.status).dot}`} />}
                  className="text-purple-600"
                >
                  <DropdownMenu aria-label="Change status">
                    <DropdownItem
                      key="active"
                      onPress={() => onStatusChange(feedback.id, 'ACTIVE')}
                      className="text-green-600"
                    >
                      Set Active
                    </DropdownItem>
                    <DropdownItem
                      key="completed"
                      onPress={() => onStatusChange(feedback.id, 'COMPLETED')}
                      className="text-blue-600"
                    >
                      Set Completed
                    </DropdownItem>
                    <DropdownItem
                      key="pending"
                      onPress={() => onStatusChange(feedback.id, 'PENDING')}
                      className="text-amber-600"
                    >
                      Set Pending
                    </DropdownItem>
                    <DropdownItem
                      key="draft"
                      onPress={() => onStatusChange(feedback.id, 'DRAFT')}
                      className="text-gray-600"
                    >
                      Set Draft
                    </DropdownItem>
                  </DropdownMenu>
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<Trash2 className="w-4 h-4" />}
                  onPress={() => onDelete(feedback.id)}
                >
                  Delete Survey
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  };

  if (feedbacks.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
        <CardBody className="py-12">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No feedback surveys yet</h3>
            <p className="text-gray-500">Create your first feedback survey to get started</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <Table 
        aria-label="Feedback surveys table"
        classNames={{
          wrapper: "min-w-full overflow-visible",
          table: "min-w-full",
          thead: "bg-default-50",
          th: "text-default-600 font-semibold text-xs uppercase tracking-wide py-2",
          td: "py-3",
          tr: "hover:bg-default-50 transition-colors",
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={onSortChange}
      >
        <TableHeader>
          <TableColumn key="feedback" className="text-left">SURVEY</TableColumn>
          <TableColumn key="scope" className="text-left">SCOPE</TableColumn>
          <TableColumn key="visibility" className="text-left">VISIBILITY</TableColumn>
          <TableColumn key="questions" className="text-center">QUESTIONS</TableColumn>
          <TableColumn key="submissions" className="text-center">RESPONSES</TableColumn>
          <TableColumn key="status" className="text-center">STATUS</TableColumn>
          <TableColumn key="created" className="text-left">CREATED</TableColumn>
          <TableColumn key="actions" className="text-center">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((feedback) => (
            <TableRow 
              key={feedback.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {(columnKey) => (
                <TableCell className="py-4">
                  {renderCell(feedback, columnKey)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <BottomContent
        page={page}
        pages={pages}
        setPage={setPage}
        totalFeedbacks={sortedItems.length}
        currentPage={page}
      />
    </div>
  );
}
