"use client";
import AddPrivilege from "@/components/privileges/AddPrivilege";

export default function AddPrivilegePage() {
  const handleCreate = (data: { name: string; description: string }) => {
    console.log("Privilege created:", data);
    // You can add logic here (e.g. API call or redirect)
  };

  const handleClose = () => {
    console.log("Form closed");
    // You can navigate or hide the form here
  };

  return <AddPrivilege onCreate={handleCreate} onClose={handleClose} />;
}
