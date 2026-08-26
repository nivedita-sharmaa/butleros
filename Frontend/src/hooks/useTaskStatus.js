// hooks/useTaskStatus.js
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useTaskStatus(onUpdated) {
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [statusError, setStatusError] = useState("");

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      setUpdatingTaskId(taskId);
      setStatusError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks/${taskId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task status");
      }

      onUpdated?.(taskId, newStatus);
    } catch (error) {
      console.error("Status update error:", error);
      setStatusError(error.message);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return { updateTaskStatus, updatingTaskId, statusError };
}