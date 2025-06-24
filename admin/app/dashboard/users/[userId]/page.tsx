"use client"; 

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { toast } from 'react-toastify';
import { UserData } from '@/types/user'; 
import { FetchProjectById } from '@/utils/userReportApi'; 
import { ProjectCompletionReports } from '@/types/userProject';
import ProjectReportTable from '@/components/usertable/ProjectReportTable';

interface UserDetailProps { params: { userId: string; };
}

const UserDetailComponent: React.FC<UserDetailProps> = ({ params }) => {
  const { userId } = params; 
  const [project, setProject] = useState<ProjectCompletionReports | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return; 

      setLoading(true);
      setError(null);
      try {
        const userData = await FetchProjectById(userId as string); 
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
  }, [userId]); 

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