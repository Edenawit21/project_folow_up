"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, Loader2, Plus } from "lucide-react";
import { Permission } from "@/types/privilege";
import { fetchAllPermissions, deletePermission } from "@/utils/privilegeApi";
import AddPrivilege from "./AddPrivilege";

// Confirm Dialog Component
const ConfirmDialog = ({
  open,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
        <p className="text-sm text-gray-700 dark:text-gray-200 mb-6">
          {message}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const PrivilegeList = () => {
  const [privileges, setPrivileges] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      const data = await fetchAllPermissions();
      setPrivileges(data);
    } catch {
      toast.error("Failed to load privileges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingId(undefined);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    loadPermissions();
    setModalOpen(false);
    setEditingId(undefined);
  };

  const requestDelete = (id: string) => {
    setTargetId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!targetId) return;
    try {
      setDeletingId(targetId);
      await deletePermission(targetId);
      toast.success("Privilege deleted.");
      loadPermissions();
    } catch {
      toast.error("Failed to delete privilege.");
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
      setTargetId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-full shadow"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Privilege</span>
        </button>
      </div>

      <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
        Privilege Management
      </h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 border-b">
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-600" />
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Loading privileges...
                  </p>
                </td>
              </tr>
            ) : privileges.length ? (
              privileges.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">{p.permissionName}</td>
                  <td className="px-6 py-4 max-w-xs whitespace-normal break-words">
                    {p.description || <i>No description</i>}
                  </td>
                  <td className="px-6 py-4">{p.action}</td>
                  <td className="px-6 py-4">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString("en-US")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 space-x-4 flex">
                    <button
                      onClick={() => handleEdit(p.id)}
                      className="text-indigo-600 hover:underline"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => requestDelete(p.id)}
                      className="text-red-600 hover:underline"
                      disabled={deletingId === p.id}
                    >
                      {deletingId === p.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-16 text-gray-500">
                  No privileges found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <AddPrivilege
            id={editingId}
            onClose={() => {
              setModalOpen(false);
              setEditingId(undefined);
            }}
            onCreate={handleSubmit}
            onUpdate={handleSubmit}
          />
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to delete this privilege?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setTargetId(null);
        }}
      />
    </div>
  );
};

export default PrivilegeList;
