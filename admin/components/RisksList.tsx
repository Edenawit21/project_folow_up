import { AddOrUpdateRiskDto, AddRiskDto, RiskDto, RiskImpact, RiskLikelihood, RiskStatus } from "@/types/projectDetail";
import { useState } from "react";
import { toast } from "react-toastify";
import RiskItem from "./RiskItem";
import { addRisk } from "@/utils/projectDetailApi";

const RisksList: React.FC<{
  projectId: string;
  risks: RiskDto[] | undefined | null;
  onRiskChanged: () => void;
}> = ({ projectId, risks, onRiskChanged }) => {
  const safeRisks = risks || [];
  const [showAddRiskForm, setShowAddRiskForm] = useState(false);
  const [newRisk, setNewRisk] = useState<AddRiskDto>({
    description: "",
    impact: RiskImpact.Low,
    likelihood: RiskLikelihood.Low,
    mitigationPlan: "",
    status: RiskStatus.Open,
    projectId,
  });
  const [isAddingRisk, setIsAddingRisk] = useState(false);

  const handleAddRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingRisk(true);
    try {
      const addedRisk = await addRisk(projectId, newRisk);
      toast.success("Risk added successfully!");
      setNewRisk({ // Reset form
        description: "",
        impact: RiskImpact.Low,
        likelihood: RiskLikelihood.Low,
        mitigationPlan: "",
        status: RiskStatus.Open,
        projectId,
      });
      setShowAddRiskForm(false); // Hide form
      onRiskChanged(); // Re-fetch parent data
    } catch (err: any) {
      toast.error(`Error adding risk: ${err.message}`);
      console.error("Error adding risk:", err);
    } finally {
      setIsAddingRisk(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200">
      <h3 className="text-xl font-semibold mb-3 text-gray-800">
        Major Risks ({safeRisks.length})
      </h3>
      <ul className="list-none p-0 space-y-3 mb-4">
        {safeRisks.length > 0 ? (
          safeRisks.map((r) => (
            <RiskItem
              key={r.id}
              risk={r}
              projectId={projectId}
              onRiskChanged={onRiskChanged}
            />
          ))
        ) : (
          <li className="text-gray-600 italic p-3 text-center">No risks defined. Click "Add New Risk" to get started.</li>
        )}
      </ul>

      {!showAddRiskForm ? (
        <div className="flex justify-center">
            <button
            onClick={() => setShowAddRiskForm(true)}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200 text-base"
            >
            Add New Risk
            </button>
        </div>
      ) : (
        <form
          onSubmit={handleAddRisk}
          className="mt-4 p-4 border border-red-200 rounded-lg bg-red-50 space-y-3"
        >
          <h4 className="text-lg font-semibold text-red-800 mb-2">
            Add New Risk
          </h4>
          <div>
            <label
              htmlFor="new-risk-description"
              className="block text-sm font-medium text-gray-700"
            >
              Description:
            </label>
            <textarea
              id="new-risk-description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm p-2"
              value={newRisk.description}
              onChange={(e) =>
                setNewRisk({ ...newRisk, description: e.target.value })
              }
              required
              disabled={isAddingRisk}
              placeholder="Briefly describe the risk."
            ></textarea>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="new-risk-impact"
                className="block text-sm font-medium text-gray-700"
              >
                Impact:
              </label>
              <select
                id="new-risk-impact"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm p-2"
                value={newRisk.impact}
                onChange={(e) =>
                  setNewRisk({
                    ...newRisk,
                    impact: Number(e.target.value) as RiskImpact,
                  })
                }
                disabled={isAddingRisk}
              >
                {Object.values(RiskImpact)
                  .filter((value) => typeof value === "number")
                  .map((impact) => (
                    <option key={impact} value={impact}>
                      {RiskImpact[impact]}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="new-risk-likelihood"
                className="block text-sm font-medium text-gray-700"
              >
                Likelihood:
              </label>
              <select
                id="new-risk-likelihood"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm p-2"
                value={newRisk.likelihood}
                onChange={(e) =>
                  setNewRisk({
                    ...newRisk,
                    likelihood: Number(e.target.value) as RiskLikelihood,
                  })
                }
                disabled={isAddingRisk}
              >
                {Object.values(RiskLikelihood)
                  .filter((value) => typeof value === "number")
                  .map((likelihood) => (
                    <option key={likelihood} value={likelihood}>
                      {RiskLikelihood[likelihood]}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="new-risk-mitigationPlan"
              className="block text-sm font-medium text-gray-700"
            >
              Mitigation Plan (Optional):
            </label>
            <textarea
              id="new-risk-mitigationPlan"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm p-2"
              value={newRisk.mitigationPlan || ""}
              onChange={(e) =>
                setNewRisk({ ...newRisk, mitigationPlan: e.target.value })
              }
              disabled={isAddingRisk}
              placeholder="Outline steps to mitigate this risk."
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="new-risk-status"
              className="block text-sm font-medium text-gray-700"
            >
              Status:
            </label>
            <select
              id="new-risk-status"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm p-2"
              value={newRisk.status}
              onChange={(e) =>
                setNewRisk({
                  ...newRisk,
                  status: Number(e.target.value) as RiskStatus,
                })
              }
              disabled={isAddingRisk}
            >
              {Object.values(RiskStatus)
                .filter((value) => typeof value === "number")
                .map((status) => (
                  <option key={status} value={status}>
                    {RiskStatus[status]}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setShowAddRiskForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm"
              disabled={isAddingRisk}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200 text-sm"
              disabled={isAddingRisk}
            >
              {isAddingRisk ? "Adding..." : "Save Risk"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default RisksList;
