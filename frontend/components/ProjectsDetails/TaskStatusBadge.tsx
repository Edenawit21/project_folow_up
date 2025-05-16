"use client";

export default function TaskStatusBadge({ status }: { status: string }) {
  const statusColors = {
    "To Do": "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    default: "bg-gray-100 text-gray-800",
  };

  const colorClass =
    statusColors[status as keyof typeof statusColors] || statusColors.default;

  return (
    <span
      className={px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}}
    >
      {status}
    </span>
  );
}