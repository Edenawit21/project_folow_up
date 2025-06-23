// app/users/[userId]/page.tsx (for Next.js App Router)
// Or pages/users/[userId].tsx (for Next.js Pages Router)

"use client"; // If this is a client component in App Router

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // For App Router
// import { useRouter } from 'next/router'; // For Pages Router
import { toast } from 'react-toastify';
import { UserData } from '@/types/user'; // Assuming UserData type
import { FetchProjectById } from '@/utils/userReportApi'; // You'll need to create this API function
import { ProjectCompletionReports } from '@/types/userProject';
import ProjectReportTable from '@/components/usertable/ProjectReportTable';

// If you have a dedicated UserDetail type with more info, use that instead of UserData
interface UserDetailProps {
  // If using App Router, params are passed directly to the page component
  params: {
    userId: string;
  };
}

const UserDetailComponent: React.FC<UserDetailProps> = ({ params }) => {
  const { userId } = params; // Get userId directly from params prop in App Router

  // For Pages Router, you'd use useRouter:
  // const router = useRouter();
  // const { userId } = router.query;

  const [project, setProject] = useState<ProjectCompletionReports | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return; // Ensure userId is available

      setLoading(true);
      setError(null);
      try {
        const userData = await FetchProjectById(userId as string); // Cast to string if it might be string[]
        setProject(userData);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        toast.error("Failed to load user details.");
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // Re-fetch if userId changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">project not found.</p>
      </div>
    );
  }

  return (
   <div>
    <ProjectReportTable data={project}/>
   </div>
  );
};

export default UserDetailComponent;