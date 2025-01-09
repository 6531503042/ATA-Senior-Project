"use client";

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { Search, Moon, Sun, ChevronDown } from 'lucide-react';

const FeedbackManagement = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState({ column: '', direction: 'ascending' });

  // Sample feedback data
  const feedbackData = [
    {
      id: 1,
      team: 'Frontend',
      project: 'Website Redesign',
      feedback: 'Great collaboration and communication within the team',
      sentiment: 'Positive',
      date: '2025-01-05'
    },
    {
      id: 2,
      team: 'Backend',
      project: 'API Development',
      feedback: 'Need more documentation and code reviews',
      sentiment: 'Neutral',
      date: '2025-01-07'
    },
    {
      id: 3,
      team: 'Design',
      project: 'Mobile App',
      feedback: 'Meeting deadlines is challenging',
      sentiment: 'Negative',
      date: '2025-01-08'
    }
  ];

  const columns = [
    { key: 'team', label: 'TEAM' },
    { key: 'project', label: 'PROJECT' },
    { key: 'feedback', label: 'FEEDBACK' },
    { key: 'sentiment', label: 'SENTIMENT' },
    { key: 'date', label: 'DATE' },
  ];

  // Filter and sort function
  const filteredData = useMemo(() => {
    let filtered = [...feedbackData];

    if (searchQuery) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (sortDescriptor.column) {
      filtered.sort((a, b) => {
        const first = a[sortDescriptor.column];
        const second = b[sortDescriptor.column];
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === 'descending' ? -cmp : cmp;
      });
    }

    return filtered;
  }, [feedbackData, searchQuery, sortDescriptor]);

  // Get suggested feedback
  const suggestedFeedback = useMemo(() => {
    return feedbackData.filter(item => item.sentiment === 'Negative');
  }, [feedbackData]);

  // Sentiment color mapping
  const sentimentColors = {
    Positive: 'success',
    Neutral: 'warning',
    Negative: 'danger'
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="w-full px-6 py-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/api/placeholder/40/40" alt="Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold">Feedback Management</h1>
        </div>
        <Button
          isIconOnly
          variant="light"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun /> : <Moon />}
        </Button>
      </div>

      <main className="container mx-auto p-6 max-w-7xl">
        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Search className="text-gray-400" />}
            className="w-full"
          />
        </div>

        {/* Feedback Table */}
        <Card className="mb-6">
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Feedback Overview</h3>
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  variant="flat" 
                  endContent={<ChevronDown />}
                >
                  Filter
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Filter options">
                <DropdownItem>All Feedback</DropdownItem>
                <DropdownItem>Positive</DropdownItem>
                <DropdownItem>Neutral</DropdownItem>
                <DropdownItem>Negative</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </CardHeader>
          <CardBody>
            <Table
              aria-label="Feedback table"
              sortDescriptor={sortDescriptor}
              onSortChange={setSortDescriptor}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key} allowsSorting>
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={filteredData}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.team}</TableCell>
                    <TableCell>{item.project}</TableCell>
                    <TableCell>{item.feedback}</TableCell>
                    <TableCell>
                      <Chip
                        color={sentimentColors[item.sentiment]}
                        variant="flat"
                        size="sm"
                      >
                        {item.sentiment}
                      </Chip>
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Suggested Improvements */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold">Suggested Areas for Improvement</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedFeedback.map((item) => (
                <Card key={item.id} className="bg-danger-50">
                  <CardBody className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{item.team} - {item.project}</h4>
                      <Chip color="danger" size="sm">{item.sentiment}</Chip>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.feedback}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
};

export default FeedbackManagement;