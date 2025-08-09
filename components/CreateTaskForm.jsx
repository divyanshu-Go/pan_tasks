"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, FileText, Paperclip, PlusCircle } from "lucide-react";

export default function CreateTaskForm({ users }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const MAX_FILES = 3;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  function handleFileChange(e) {
    setError("");
    const chosen = Array.from(e.target.files || []);
    if (chosen.length + files.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed.`);
      return;
    }
    for (const f of chosen) {
      if (f.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        setError("One or more files exceed the size limit (10MB).");
        return;
      }
    }
    setFiles((prev) => [...prev, ...chosen]);
    e.target.value = null;
  }

  function removeFile(idx) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (files.length > MAX_FILES) {
      setError(`You can upload up to ${MAX_FILES} files.`);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("priority", priority);
      if (dueDate) formData.append("dueDate", dueDate);
      if (assignedTo) formData.append("assignedTo", assignedTo);

      for (const f of files) {
        formData.append("files", f);
      }

      const res = await fetch("/api/tasks/create-with-files", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create task");
        setLoading(false);
        return;
      }

      setSuccess("Task created successfully!");
      setTitle("");
      setDescription("");
      setFiles([]);
      setAssignedTo("");
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-sm border border-orange-100">
      <h2 className="text-2xl font-semibold mb-1 text-orange-600 flex items-center gap-2">
        <PlusCircle className="w-6 h-6" />
        Create Task
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Fill in the details below to create a new task.
      </p>

      {error && <div className="mb-3 text-red-600">{error}</div>}
      {success && <div className="mb-3 text-green-600">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
            <Edit3 className="w-4 h-4 text-orange-500" /> Title *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-orange-200 px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            placeholder="Enter task title"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            A short, clear name for the task.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
            <FileText className="w-4 h-4 text-orange-500" /> Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-orange-200 px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            placeholder="Add more context to this task..."
            rows={3}
          />
          <p className="text-xs text-gray-400 mt-1">
            Optional: add any details or requirements.
          </p>
        </div>

        {/* Status & Priority */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-orange-200 px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-progress</option>
              <option value="completed">Completed</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Current progress state.
            </p>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-orange-200 px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              How urgent this task is.
            </p>
          </div>
        </div>

        {/* Due date & Assign to */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Due date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-orange-200 px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Optional: set a deadline.
            </p>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Assign to
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-orange-200 px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value="">Unassigned</option>
              {users?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Select a team member to assign.
            </p>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
            <Paperclip className="w-4 h-4 text-orange-500" /> Attach PDFs (max
            3)
          </label>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
            name="files"
          />
          <p className="text-xs text-gray-400 mt-1">
            Only PDF files, up to 10MB each.
          </p>

          <div className="mt-2 space-y-1">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm py-1"
              >
                <span className="truncate">
                  {f.name} ({Math.round(f.size / 1024)} KB)
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="ml-3 text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="grow px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-60 transition"
          >
            {loading ? "Uploading..." : "Create Task"}
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setDescription("");
              setFiles([]);
              setError("");
              setSuccess("");
            }}
            className="px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
