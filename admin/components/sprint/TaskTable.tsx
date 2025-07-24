"use client";
import React, { useState, useMemo } from "react";
import { TaskInSprint } from "@/types/sprint";
import { Book, Bug, CheckCircle, KanbanSquare, ListFilter, User, Clock } from "lucide-react";
import Card from "@/components/ProjectsDetails/Card";
import Table from "@/components/ProjectsDetails/Table";
import { formatDate } from "@/utils/sprintApi";
import PaginationFooter from "@/components/footer/PaginationFooter";


interface TasksTableProps {
  tasks: TaskInSprint[];
}

// New component for expandable text
const ExpandableText: React.FC<{ text: string; maxLength: number }> = ({ text, maxLength }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  const displayedText = isExpanded ? text : `${text.substring(0, maxLength)}...`;

  return (
    <span>
      {displayedText}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-1 text-blue-600 dark:text-blue-400 hover:underline text-xs"
      >
        {isExpanded ? "Show Less" : "Show More"}
      </button>
    </span>
  );
};


const TasksTable: React.FC<TasksTableProps> = ({ tasks }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);

  const totalTasks = tasks.length;
  const totalPages = Math.ceil(totalTasks / rowsPerPage);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return tasks.slice(startIndex, endIndex);
  }, [tasks, currentPage, rowsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  // Headers array with explicit Tailwind width classes for better control
  const headers = [
    { name: "Key", className: "w-[8%]" }, // Adjusted width
    { name: "Summary", className: "w-[35%]" }, // INCREASED WIDTH FOR SUMMARY
    { name: "Type", className: "w-[10%]" },
    { name: "Status", className: "w-[10%]" },
    { name: "Assignee", className: "w-[10%]" },
    { name: "Due Date", className: "w-[10%]" },
    { name: "SP", className: "w-[5%]" },
    { name: "Sprint", className: "w-[10%]" },
    { name: "Priority", className: "w-[10%]" },
  ];

  const getIssueTypeIcon = (issueType: string | null) => {
    switch (issueType?.toLowerCase()) {
      case 'story': return <Book className="h-4 w-4 text-green-500 mr-1" />;
      case 'bug': return <Bug className="h-4 w-4 text-red-500 mr-1" />;
      case 'task': return <CheckCircle className="h-4 w-4 text-blue-500 mr-1" />;
      case 'epic': return <KanbanSquare className="h-4 w-4 text-purple-500 mr-1" />;
      default: return <ListFilter className="h-4 w-4 text-gray-500 mr-1" />;
    }
  };

  const getStatusClasses = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'to do':
      case 'selected for development':
        return 'bg-gray-200 text-gray-800';
      case 'in progress':
        return 'bg-blue-200 text-blue-800';
      case 'done':
        return 'bg-green-200 text-green-800';
      case 'blocked':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderRow = (task: TaskInSprint, index: number) => (
    <tr key={task.key || index} className="dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
        <a href={`/tasks/${task.key}`} className="hover:underline">
          {task.key}
        </a>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
        <ExpandableText text={task.title ?? ''} maxLength={50} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
        <span className="flex items-center">
          {getIssueTypeIcon(task.issueType)}
          {task.issueType}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(task.status)}`}>
          {task.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center">
          <User className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
          {task.assigneeName || 'Unassigned'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
        {task.dueDate ? (
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
            {formatDate(task.dueDate)}
          </div>
        ) : 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
        {task.storyPoints?.toFixed(0) || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
        {task.currentSprintName || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-gray-200">
        {task.priority || 'N/A'}
      </td>
    </tr>
  );

  return (
    <Card title="Tasks in Sprint" icon={ListFilter}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${header.className}`}
                >
                  {header.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedTasks.length > 0 ? (
              paginatedTasks.map((task, index) => renderRow(task, index))
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No tasks found for this sprint.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalItems={totalTasks}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Card>
  );
};

export { TasksTable };