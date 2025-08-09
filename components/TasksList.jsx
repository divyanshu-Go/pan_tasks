"use client"

import { Paperclip, FileText } from 'lucide-react';

export default function TasksList({ tasks }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100';
      case 'in-progress': return 'text-blue-700 bg-blue-100';
      case 'pending': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
  <div className="space-y-4">
    {tasks.map((task) => (
      <div
        key={task._id}
        onClick={() => window.location.href = `/tasks/${task._id}`}
        className="bg-white rounded-xl shadow-sm p-5 hover:shadow-lg transition cursor-pointer border border-orange-100"
      >
        {/* Title + Badges */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-semibold text-orange-700">{task.title}</h2>
            {task.description && (
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority?.toUpperCase()}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status?.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* People Info */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
          <div>
            <span className="block text-xs text-gray-400">Assigned To</span>
            <span className="font-medium">{task.assignedTo?.name || 'Unassigned'}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400">Assigned By</span>
            <span className="font-medium">{task.createdBy?.name || 'Unknown'}</span>
          </div>
        </div>

        {/* Attachments Count */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Paperclip className="w-4 h-4 text-orange-500" />
          <span>{task.attachments?.length || 0} Document{task.attachments?.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    ))}
  </div>
);

}
