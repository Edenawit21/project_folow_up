import AddPrivilege from "@/components/privileges/AddPrivilege";

export default function AddPrivilegePage() {
  const handleCreate = (data: any) => {
    console.log("Privilege created:", data);
    // Add logic to save or process privilege data
  };

  const handleClose = () => {
    console.log("AddPrivilege closed");
    // Add logic to navigate back or hide the form
  };

  return <AddPrivilege onCreate={handleCreate} onClose={handleClose} />;
}
