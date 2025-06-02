"use client";
import AddPrivilege from "@/components/privileges/AddPrivilege";
export default function AddPrivilegePage() { 
  return(<AddPrivilege onCreate={function (data: { name: string; description: string; }): void {
    throw new Error("Function not implemented.");
  } } onClose={function (): void {
    throw new Error("Function not implemented.");
  } }/>)
}