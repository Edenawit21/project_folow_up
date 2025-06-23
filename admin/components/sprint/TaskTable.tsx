"use client";
import React, { useState, useMemo } from "react"; 
import { TaskInSprint } from "@/types/sprint"; 
import { Book, Bug, CheckCircle, KanbanSquare, ListFilter, User, Clock } from "lucide-react"; 
import Card from "@/components/ProjectsDetails/Card"; 
import Table from "@/components/ProjectsDetails/Table"; 
import { formatDate } from "@/utils/sprintApi"; 
import PaginationFooter from "@/components/footer/PaginationFooter"; 


interface TasksTableProps {
  tasks: TaskInSprint[]; // Corrected: should be an array of TaskInSprint
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  // Set rowsPerPage to 6 as requested
  const [rowsPerPage, setRowsPerPage] = useState<number>(6); 

  const totalTasks = tasks.length;
  const totalPages = Math.ceil(totalTasks / rowsPerPage);

  // Memoize the paginated tasks to prevent unnecessary re-calculations
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

  // This handler is needed for the PaginationFooter component's props,
  // even if rowsPerPage is fixed at 6 in this component.
  // We can choose to ignore its effect here or adapt the PaginationFooter later.
  const handleRowsPerPageChange = (rows: number) => {
    // If you strictly want 6 rows, you can ignore the `rows` parameter here
    // or log a warning if it's not 6.
    // For now, we'll let it update, but the UI might not reflect changes if the select is removed.
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  const headers = [
    "Key",
    "Summary",
    "Type",
    "Status",
    "Assignee",
    "Due Date",
    "SP", // Story Points
    "Sprint",
    "Priority", // ADDED HEADER for Priority
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
    <tr key={task.key || index} className="dark:hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
        <a href={`/tasks/${task.key}`} className="hover:underline">
          {task.key}
        </a>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-sm truncate">{task.title}</td>
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
      <Table
        headers={headers}
        data={paginatedTasks} 
        renderRow={renderRow}
        emptyMessage="No tasks found for this sprint."
      />
      {/* Render the PaginationFooter */}
      <PaginationFooter
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalItems={totalTasks}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange} // This handler is still needed for props interface
      />
    </Card>
  );
};

export { TasksTable };