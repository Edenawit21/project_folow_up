// app/notifications/page.tsx

export default function NotificationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {/* Example notifications list */}
      <ul className="space-y-3">
        <li className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm">
          🔔 You’ve been assigned to **Project Alpha**
        </li>
        <li className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm">
          ✅ Task “Design UI” marked as complete
        </li>
        <li className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm">
          📅 Sprint planning scheduled for tomorrow
        </li>
      </ul>
    </div>
  );
}
