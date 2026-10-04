"use client";

import { useFormStatus } from "react-dom";

export function DeleteButton({ message = "Are you sure you want to delete this?", className = "text-red-600 hover:text-red-900" }: { message?: string, className?: string }) {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit"
      className={`${className} disabled:opacity-50`}
      disabled={pending}
      onClick={(e) => {
        if (!confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
