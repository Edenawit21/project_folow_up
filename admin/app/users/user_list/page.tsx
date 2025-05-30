import UserList from "@/components/users/UserList";
export default function UsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center dark:text-gray-100 dark:bg-slate-900">User Management</h1>
      <UserList token={""} />
    </div>
  );
}