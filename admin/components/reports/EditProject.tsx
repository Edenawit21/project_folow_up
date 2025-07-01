import { OverallProjectStatus, ProjectDetailDto } from "@/types/projectDetail";
import { getProjectDetails, updateProjectStrategicDetails, } from "@/utils/projectDetailApi";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import RiskList from "@/components/risk/RisksList";
import MilestonesList from "@/components/milestone/MilestonesList";

interface ProjectStrategicEditFormProps {
  projectId: string;
  onSaveSuccess?: () => void;
}

const ProjectStrategicEditForm: React.FC<ProjectStrategicEditFormProps> = ({
  projectId,
  onSaveSuccess,
}) => {
  const [projectData, setProjectData] = useState<ProjectDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [overallProjectStatus, setOverallProjectStatus] =
    useState<OverallProjectStatus>(OverallProjectStatus.Active);
  const [executiveSummary, setExecutiveSummary] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerContactInfo, setOwnerContactInfo] = useState<string>("");
  const [projectStartDate, setProjectStartDate] = useState<string>("");
  const [targetEndDate, setTargetEndDate] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string | null>(null);
  const [lead, setLead] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProjectDetails(projectId);
        if (data) {
          setProjectData(data);
          setOverallProjectStatus(
            OverallProjectStatus[
              data.overallProjectStatus as unknown as keyof typeof OverallProjectStatus
            ]
          );
          setExecutiveSummary(data.executiveSummary || "");
          setOwnerName(data.ownerName || "");
          setOwnerContactInfo(data.ownerContactInfo || "");
          setProjectStartDate(data.projectStartDate?.split("T")[0] || "");
          setTargetEndDate(data.targetEndDate?.split("T")[0] || "");
          setName(data.name);
          setDescription(data.description);
          setLead(data.lead);
        } else {
          setError("Project details not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load project details.");
        toast.error("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProjectDetails();
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!projectData) {
      toast.error("No project data to save.");
      setIsSaving(false);
      return;
    }

    try {
      const updateData = {
        name,
        description,
        leadName: lead,
        overallStatus: overallProjectStatus,
        executiveSummary,
        ownerName: ownerName || null,
        ownerContact: ownerContactInfo || null,
        projectStartDate: projectStartDate
          ? new Date(projectStartDate).toISOString()
          : null,
        targetEndDate: targetEndDate
          ? new Date(targetEndDate).toISOString()
          : null,
      };

      await updateProjectStrategicDetails(projectId, updateData);
      toast.success("Project strategic details saved successfully!");
      onSaveSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to save project details.");
      toast.error(`Error saving details: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-300">
        Loading project strategic details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 dark:text-red-400">
        <p>Error: {error}</p>
        <p className="text-gray-500 text-sm mt-2 dark:text-gray-400">
          Please ensure the project ID is valid and the API is running.
        </p>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="text-center p-8 text-gray-600 dark:text-gray-300">
        No project data loaded. Please provide a valid project ID.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 font-sans pt-0 px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-100">
      <ToastContainer position="bottom-right" autoClose={5000} />
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg p-6 sm:p-8 border border-gray-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Edit Strategic Project Details: {projectData.name} ({projectData.key})
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6"> 
          Manage high-level project status, owner, summary, dates, milestones,
          and risks.
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Project Name:</label>
              <input
                type="text"
                value={name}
                disabled
                className="w-full px-3 py-2 rounded border shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white dark:border-gray-400"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Jira Lead:</label>
              <input
                type="text"
                value={lead || "N/A"}
                disabled
                className="w-full px-3 py-2 rounded border shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white dark:border-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Jira Description:</label>
            <textarea
              value={description || "No description from Jira."}
              disabled
              rows={3}
              className="w-full px-3 py-2 rounded border shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white dark:border-gray-400"
            />
          </div>

          <hr className="my-8 border-gray-200 dark:border-gray-400" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">
                Overall Project Status:
              </label>
              <select
                className="w-full px-3 py-2 rounded border shadow-sm text-gray-800 dark:text-white bg-white dark:bg-gray-800 dark:border-gray-300"
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
                  )
                  .map((key) => {
                    const value =
                      OverallProjectStatus[
                        key as keyof typeof OverallProjectStatus
                      ];
                    return (
                      <option key={value} value={value}>
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">
                Product Owner Name:
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                disabled={isSaving}
                className="w-full px-3 py-2 rounded border shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">
                Product Owner Contact Info:
              </label>
              <input
                type="text"
                value={ownerContactInfo}
                onChange={(e) => setOwnerContactInfo(e.target.value)}
                disabled={isSaving}
                placeholder="Email or Phone"
                className="w-full px-3 py-2 rounded border shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">
                Project Start Date:
              </label>
              <input
                type="date"
                value={projectStartDate}
                onChange={(e) => setProjectStartDate(e.target.value)}
                disabled={isSaving}
                className="w-full px-3 py-2 rounded border shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Target End Date:</label>
              <input
                type="date"
                value={targetEndDate}
                onChange={(e) => setTargetEndDate(e.target.value)}
                disabled={isSaving}
                className="w-full px-3 py-2 rounded border shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Executive Summary:</label>
            <textarea
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
              rows={5}
              disabled={isSaving}
              className="w-full px-3 py-2 rounded border shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              placeholder="Provide a concise summary of the project's current state, achievements, challenges, and outlook."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-2 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow hover:bg-blue-500 disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Strategic Details"}
            </button>
          </div>
        </form>

        <hr className="my-8 border-gray-200 dark:border-slate-600" />
        <MilestonesList
          projectId={projectId}
          milestones={projectData.milestones}
          onMilestoneChanged={() =>
            getProjectDetails(projectId).then(setProjectData)
          }
        />
        <hr className="my-8 border-gray-200 dark:border-slate-600" />
        <RiskList
          projectId={projectId}
          risks={projectData.risks}
          onRiskChanged={() =>
            getProjectDetails(projectId).then(setProjectData)
          }
        />
      </div>
    </div>
  );
};

export default ProjectStrategicEditForm;