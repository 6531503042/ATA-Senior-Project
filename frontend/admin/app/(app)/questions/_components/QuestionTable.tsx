import { Question, QuestionType, QuestionCategory } from "@/types/question";
import { SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { Key, useCallback, useMemo, useState } from "react";
import QuestionCellRenderer from "./QuestionCellRenderer";
import TopContent from "./TopContent";
import BottomContent from "./BottomContent";
import { MessageSquareIcon } from "lucide-react";

const COLUMNS = [
  { name: "QUESTION", uid: "question", allowsSorting: false },
  { name: "TYPE", uid: "type", allowsSorting: true },
  { name: "CATEGORY", uid: "category", allowsSorting: true },
  { name: "REQUIRED", uid: "required", allowsSorting: true },
  { name: "STATUS", uid: "status", allowsSorting: true },
  { name: "ACTIONS", uid: "actions", allowsSorting: false },
];

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
  onRefresh 
}: QuestionTableProps) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedType, setSelectedType] = useState<QuestionType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory[]>([]);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "question",
    direction: "ascending"
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleSearch = (value: string) => {
    setFilterValue(value);
    setPage(1);
  };

  const handleClear = () => {
    setFilterValue("");
    setPage(1);
  };

  const handleTypeChange = (type: QuestionType[]) => {
    setSelectedType(type);
    setPage(1);
  };

  const handleCategoryChange = (category: QuestionCategory[]) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const filteredItems = useMemo(() => {
    let filteredQuestions = [...(questions ?? [])];
    const query = filterValue.toLowerCase();

    if (!!filterValue) {
      filteredQuestions = questions.filter(
        (question) =>
          question.title.toLowerCase().includes(query) ||
          question.description?.toLowerCase().includes(query) ||
          question.category.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (selectedType.length > 0) {
      filteredQuestions = filteredQuestions.filter(question =>
        selectedType.includes(question.type)
      );
    }

    // Filter by category
    if (selectedCategory.length > 0) {
      filteredQuestions = filteredQuestions.filter(question =>
        selectedCategory.includes(question.category)
      );
    }

    return filteredQuestions;
  }, [questions, filterValue, selectedType, selectedCategory]);

  const questionItems = useMemo(() => {
    const sortedItems = [...filteredItems];

    if (sortDescriptor.column && sortDescriptor.direction) {
      sortedItems.sort((a, b) => {
        const direction = sortDescriptor.direction === "ascending" ? 1 : -1;

        if (sortDescriptor.column === "type") {
          return a.type.localeCompare(b.type) * direction;
        }

        if (sortDescriptor.column === "category") {
          return a.category.localeCompare(b.category) * direction;
        }

        if (sortDescriptor.column === "required") {
          return (a.required === b.required ? 0 : a.required ? 1 : -1) * direction;
        }

        if (sortDescriptor.column === "status") {
          return (a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1) * direction;
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
          question={question}
          columnKey={columnKey}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
    [onEdit, onDelete]
  );

  return (
    <div className="rounded-xl shadow-xl overflow-hidden">
      <Table
        isHeaderSticky
        aria-label="Questions Table"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        topContentPlacement="outside"
        topContent={
          <TopContent
            filterValue={filterValue}
            onClear={handleClear}
            onSearchChange={handleSearch}
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onRefresh={onRefresh || (() => {})}
          />
        }
        bottomContentPlacement="outside"
        bottomContent={
          <BottomContent
            page={page}
            pages={pages}
            setPage={setPage}
            totalQuestions={filteredItems.length}
            currentPage={page}
          />
        }
        classNames={{
          wrapper: "shadow-none",
          table: "min-h-[400px]",
          th: "text-default-600 border-b border-blue-200 font-semibold",
          tr: "border-b border-blue-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200",
          td: "border-b border-blue-100",
        }}
      >
        <TableHeader columns={COLUMNS}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.allowsSorting}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-default-400 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquareIcon className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-lg font-medium text-default-500">No questions found</p>
                <p className="text-sm text-default-400">Try adjusting your search or filters</p>
              </div>
            </div>
          }
          items={[...questionItems]}
        >
          {(question: Question) => (
            <TableRow
              key={question.id}
              className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200"
            >
              {(columnKey) => (
                <TableCell className={`${columnKey.toString()} py-4`}>
                  {renderCell(question, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
