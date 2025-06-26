import { OverallProjectStatus, ProjectDetailDto } from "@/types/projectDetail";
import {
  getProjectDetails,
  updateProjectStrategicDetails,
} from "@/utils/projectDetailApi";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import RiskList from "./RisksList";
import MilestonesList from "./MilestonesList";

interface ProjectStrategicEditFormProps {
  projectId: string; // The ID of the project to edit
  onSaveSuccess?: () => void; // Optional callback after a successful save
}

const ProjectStrategicEditForm: React.FC<ProjectStrategicEditFormProps> = ({
  projectId,
  onSaveSuccess,
}) => {
  const [projectData, setProjectData] = useState<ProjectDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for editable fields
  const [overallProjectStatus, setOverallProjectStatus] =
    useState<OverallProjectStatus>(OverallProjectStatus.Active);
  const [executiveSummary, setExecutiveSummary] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerContactInfo, setOwnerContactInfo] = useState<string>("");
  const [projectStartDate, setProjectStartDate] = useState<string>(""); // ISO string for date input
  const [targetEndDate, setTargetEndDate] = useState<string>(""); // ISO string for date input

  // Basic Jira-synced fields (read-only in this form, but part of the update command)
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string | null>(null);
  const [lead, setLead] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProjectDetails(projectId);
        console.log("Fetched project data:", data); // Debugging log
        if (data) {
          setProjectData(data);
          // Populate form fields with fetched data
          setOverallProjectStatus(OverallProjectStatus[data.overallProjectStatus as unknown as keyof typeof OverallProjectStatus]);

          setExecutiveSummary(data.executiveSummary || "");
          setOwnerName(data.ownerName || "");
          setOwnerContactInfo(data.ownerContactInfo || "");
          setProjectStartDate(
            data.projectStartDate ? data.projectStartDate.split("T")[0] : ""
          ); // Format to YYYY-MM-DD for input type="date"
          setTargetEndDate(
            data.targetEndDate ? data.targetEndDate.split("T")[0] : ""
          ); // Format to YYYY-MM-DD for input type="date"
          // Also populate Jira-synced fields (though they are read-only here)
          setName(data.name);
          setDescription(data.description);
          setLead(data.lead);
        } else {
          setError("Project details not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load project details.");
        console.error("Error fetching project details:", err);
        toast.error("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!projectData) {
      // Should not happen if loading state is handled
      toast.error("No project data to save.");
      setIsSaving(false);
      return;
    }

    try {
      // Prepare data for the update command
      const updateData = {
        // These are passed because the backend UpdateStrategicDetailsCommand expects them
        // even if they are primarily Jira-synced (decide if PM can override them).
        // If PM CANNOT override Name, Desc, Lead via this form, you should remove these from the command.
        name: name,
        description: description,
        leadName: lead,

        overallStatus: overallProjectStatus,
        executiveSummary: executiveSummary,
        ownerName: ownerName || null, // Ensure empty string becomes null for backend
        ownerContact: ownerContactInfo || null, // Ensure empty string becomes null
        projectStartDate: projectStartDate
          ? new Date(projectStartDate).toISOString()
          : null,
        targetEndDate: targetEndDate
          ? new Date(targetEndDate).toISOString()
          : null,
      };

      await updateProjectStrategicDetails(projectId, updateData);
      toast.success("Project strategic details saved successfully!");
      onSaveSuccess?.(); // Call callback if provided
    } catch (err: any) {
      setError(err.message || "Failed to save project details.");
      console.error("Error saving project details:", err);
      toast.error(`Error saving details: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading project strategic details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>Error: {error}</p>
        <p className="text-gray-500 text-sm mt-2">
          Please ensure the project ID is valid and the API is running.
        </p>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="text-center p-8 text-gray-600">
        No project data loaded. Please provide a valid project ID.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6 lg:p-8">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Edit Strategic Project Details: {projectData.name} ({projectData.key})
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Manage high-level project status, owner, summary, dates, milestones,
          and risks.
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Project Info (read-only, primarily Jira-synced) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Project Name:
              </label>
              <input
                type="text"
                value={name}
                disabled // Read-only
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Jira Lead:
              </label>
              <input
                type="text"
                value={lead || "N/A"}
                disabled // Read-only
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Jira Description:
            </label>
            <textarea
              value={description || "No description from Jira."}
              disabled // Read-only
              rows={3}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight"
            ></textarea>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Strategic Project Details (PM-curated) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="overallStatus"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Overall Project Status:
              </label>
              <select
                id="overallStatus"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                value={overallProjectStatus}
                onChange={(e) =>
                  setOverallProjectStatus(
                    Number(e.target.value) as OverallProjectStatus
                  )
                }
                disabled={isSaving}
              >
                {Object.keys(OverallProjectStatus)
                  .filter(
                    (key) => !isNaN(Number(OverallProjectStatus[key as any]))
                  ) // Only enum names
                  .map((key) => {
                    const value = OverallProjectStatus[
                      key as keyof typeof OverallProjectStatus
                    ] as number;
                    return (
                      <option key={value} value={value}>
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div>
              <label
                htmlFor="projectOwnerName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Project Owner Name:
              </label>
              <input
                type="text"
                id="projectOwnerName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div>
              <label
                htmlFor="ownerContactInfo"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Project Owner Contact Info:
              </label>
              <input
                type="text"
                id="ownerContactInfo"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                value={ownerContactInfo}
                onChange={(e) => setOwnerContactInfo(e.target.value)}
                disabled={isSaving}
                placeholder="Email or Phone"
              />
            </div>
            <div>
              <label
                htmlFor="projectStartDate"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Project Start Date:
              </label>
              <input
                type="date"
                id="projectStartDate"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                value={projectStartDate}
                onChange={(e) => setProjectStartDate(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div>
              <label
                htmlFor="targetEndDate"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Target End Date:
              </label>
              <input
                type="date"
                id="targetEndDate"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                value={targetEndDate}
                onChange={(e) => setTargetEndDate(e.target.value)}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="executiveSummary"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Executive Summary:
            </label>
            <textarea
              id="executiveSummary"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
              rows={5}
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
              disabled={isSaving}
              placeholder="Provide a concise summary of the project's current state, achievements, challenges, and outlook."
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Strategic Details"}
            </button>
          </div>
        </form>

        <hr className="my-8 border-gray-200" />

        {/* Milestones Section */}
        <MilestonesList
          projectId={projectId}
          milestones={projectData.milestones}
          onMilestoneChanged={() =>
            getProjectDetails(projectId).then(setProjectData)
          } // Re-fetch data on change
        />

        <hr className="my-8 border-gray-200" />

        {/* Risks Section */}
        <RiskList
          projectId={projectId}
          risks={projectData.risks}
          onRiskChanged={() =>
            getProjectDetails(projectId).then(setProjectData)
          } // Re-fetch data on change
        />
      </div>
    </div>
  );
};

export default ProjectStrategicEditForm;
