import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
} from '@heroui/react';
import { Key, useCallback, useMemo, useState } from 'react';

import QuestionCellRenderer from './QuestionCellRenderer';
import TopContent from './TopContent';
import BottomContent from './BottomContent';

import { Question } from '@/types/question';

const COLUMNS = [
  { name: 'QUESTION', uid: 'question', allowsSorting: false },
  { name: 'TYPE', uid: 'type', allowsSorting: true },
  { name: 'CATEGORY', uid: 'category', allowsSorting: true },
  { name: 'REQUIRED', uid: 'required', allowsSorting: true },
  { name: 'STATUS', uid: 'status', allowsSorting: true },
  { name: 'ACTIONS', uid: 'actions', allowsSorting: false },
];

const questionTypeColors = {
  TEXT: 'default',
  MULTIPLE_CHOICE: 'primary',
  RATING: 'warning',
  BOOLEAN: 'success',
} as const;

const questionTypeIcons = {
  TEXT: '📝',
  MULTIPLE_CHOICE: '☑️',
  RATING: '⭐',
  BOOLEAN: '✅',
} as const;

type QuestionTableProps = {
  questions: Question[];
  onEdit?: (question: Question) => void;
  onDelete?: (questionId: string) => void;
  onRefresh?: () => void;
};

export default function QuestionTable({
  questions,
  onEdit,
  onDelete,
  onRefresh,
}: QuestionTableProps) {
  const [filterValue, setFilterValue] = useState('');
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'question',
    direction: 'ascending',
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSearch = (value: string) => {
    setFilterValue(value);
    setPage(1);
  };

  const handleClear = () => {
    setFilterValue('');
    setPage(1);
  };

  const handleTypeChange = (type: string[]) => {
    setSelectedType(type);
    setPage(1);
  };

  const handleCategoryChange = (category: string[]) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const filteredItems = useMemo(() => {
    let filteredQuestions = [...(questions ?? [])];
    const query = filterValue.toLowerCase();

    if (!!filterValue) {
      filteredQuestions = questions.filter(
        question =>
          question.text.toLowerCase().includes(query) ||
          question.category?.toLowerCase().includes(query),
      );
    }

    // Filter by type
    if (selectedType.length > 0) {
      filteredQuestions = filteredQuestions.filter(question =>
        selectedType.includes(question.type),
      );
    }

    // Filter by category
    if (selectedCategory.length > 0) {
      filteredQuestions = filteredQuestions.filter(question =>
        question.category && selectedCategory.includes(question.category),
      );
    }

    return filteredQuestions;
  }, [questions, filterValue, selectedType, selectedCategory]);

  const questionItems = useMemo(() => {
    const sortedItems = [...filteredItems];

    if (sortDescriptor.column && sortDescriptor.direction) {
      sortedItems.sort((a, b) => {
        const direction = sortDescriptor.direction === 'ascending' ? 1 : -1;

        if (sortDescriptor.column === 'type') {
          return a.type.localeCompare(b.type) * direction;
        }

        if (sortDescriptor.column === 'category') {
          const categoryA = a.category || '';
          const categoryB = b.category || '';
          return categoryA.localeCompare(categoryB) * direction;
        }

        if (sortDescriptor.column === 'required') {
          return (
            (a.required === b.required ? 0 : a.required ? 1 : -1) * direction
          );
        }

        if (sortDescriptor.column === 'status') {
          return (
            (a.required === b.required ? 0 : a.required ? 1 : -1) * direction
          );
        }

        return 0;
      });
    }

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, filteredItems, sortDescriptor]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const renderCell = useCallback(
    (question: Question, columnKey: Key) => {
      return (
        <QuestionCellRenderer
          columnKey={columnKey}
          question={question}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      );
    },
    [onEdit, onDelete],
  );

  return (
    <div className="w-full flex flex-col">
      <Table
        aria-label="Questions Table"
        classNames={{
          wrapper: 'min-w-full overflow-visible',
          table: 'min-w-full',
          thead: 'bg-default-50',
          th: 'text-default-700 font-semibold text-xs uppercase tracking-wide',
          tr: 'hover:bg-default-50 transition-colors',
          td: 'py-3',
        }}
        sortDescriptor={sortDescriptor}
        topContent={
          <TopContent
            filterValue={filterValue}
            selectedCategory={selectedCategory}
            selectedType={selectedType}
            onCategoryChange={handleCategoryChange}
            onClear={handleClear}
            onRefresh={onRefresh || (() => {})}
            onSearchChange={handleSearch}
            onTypeChange={handleTypeChange}
          />
        }
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
      <TableHeader columns={COLUMNS}>
        {column => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.allowsSorting}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={
          <div className="flex flex-col items-center justify-center py-8">
            <span className="text-default-400">No questions found</span>
          </div>
        }
        items={[...questionItems]}
      >
        {(question: Question) => (
          <TableRow
            key={question.id}
            className="hover:bg-default-50 transition-colors"
          >
            {columnKey => (
              <TableCell className={`${columnKey.toString()} py-4`}>
                {renderCell(question, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
      </Table>
      
      {/* Pagination at Bottom */}
      <BottomContent
        currentPage={page}
        page={page}
        pages={pages}
        setPage={setPage}
        totalQuestions={filteredItems.length}
      />
    </div>
  );
}
