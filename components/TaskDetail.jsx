"use client";

import { Paperclip, FileText, UserCheck, User } from "lucide-react";

export default function TaskDetail({ task }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return (
      new Date(dateString).toLocaleDateString() +
      " " +
      new Date(dateString).toLocaleTimeString()
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-700 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-700 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-700 bg-green-100 border-green-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-700 bg-green-100 border-green-200";
      case "in-progress":
        return "text-blue-700 bg-blue-100 border-blue-200";
      case "pending":
        return "text-gray-700 bg-gray-100 border-gray-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-orange-700">{task.title}</h1>
          {task.description && (
            <p className="mt-1 text-gray-600 text-sm">{task.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority?.toUpperCase()}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              task.status
            )}`}
          >
            {task.status?.replace("-", " ").toUpperCase()}
          </span>
        </div>
      </div>

      {/* Task Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
          <h4 className="text-xs font-semibold text-orange-600 mb-1">
            Assigned By
          </h4>
          <p className="text-sm text-gray-700">
            {task.createdBy?.email || "Unknown"}
          </p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
          <h4 className="text-xs font-semibold text-orange-600 mb-1">
            Assigned To
          </h4>
          <p className="text-sm text-gray-700">
            {task.assignedTo?.email || "Unassigned"}
          </p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
          <h4 className="text-xs font-semibold text-orange-600 mb-1">
            Due Date
          </h4>
          <p className="text-sm text-gray-700">{formatDate(task.dueDate)}</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
          <h4 className="text-xs font-semibold text-orange-600 mb-1">
            Created Date
          </h4>
          <p className="text-sm text-gray-700">{formatDate(task.createdAt)}</p>
        </div>
      </div>

      {/* Attachments */}
      {task.attachments?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-orange-500" />
            Attachments ({task.attachments.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {task.attachments.map((attachment, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-orange-700 truncate">
                      Document {index + 1}
                    </h4>
                    <div className="mt-3 flex gap-2">
                      <a
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                      >
                        View
                      </a>
                      <a
                        href={attachment.fileUrl}
                        download
                        className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded border border-orange-200 hover:bg-orange-200 transition"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
