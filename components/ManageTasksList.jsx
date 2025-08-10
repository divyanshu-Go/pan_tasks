"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Paperclip, Trash2, AlertCircle } from 'lucide-react';
import { updateTaskStatus, deleteTask } from '@/lib/api/taskApi';
import ConfirmModal from '@/components/ConfirmModal';

export default function ManageTasksList({ tasks }) {
  const router = useRouter();
  const [loadingTasks, setLoadingTasks] = useState(new Set());
  const [taskStatuses, setTaskStatuses] = useState(
    tasks.reduce((acc, task) => ({ ...acc, [task._id]: task.status }), {})
  );
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, task: null });
  const [messages, setMessages] = useState({});

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

  const handleStatusChange = async (taskId, newStatus) => {
    if (newStatus === taskStatuses[taskId]) return;
    
    setLoadingTasks(prev => new Set(prev).add(taskId));
    setMessages(prev => ({ ...prev, [taskId]: null }));
    
    try {
      const result = await updateTaskStatus(taskId, newStatus);
      
      if (result.success) {
        setTaskStatuses(prev => ({ ...prev, [taskId]: newStatus }));
        setMessages(prev => ({ 
          ...prev, 
          [taskId]: { type: 'success', text: 'Status updated successfully!' }
        }));
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessages(prev => ({ ...prev, [taskId]: null }));
        }, 3000);
      } else {
        setMessages(prev => ({ 
          ...prev, 
          [taskId]: { type: 'error', text: result.error }
        }));
      }
    } catch (err) {
      setMessages(prev => ({ 
        ...prev, 
        [taskId]: { type: 'error', text: 'Failed to update status' }
      }));
    } finally {
      setLoadingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleDeleteClick = (task) => {
    setDeleteModal({ isOpen: true, task });
  };

  const handleDeleteConfirm = async () => {
    const { task } = deleteModal;
    if (!task) return;

    setLoadingTasks(prev => new Set(prev).add(task._id));
    setMessages(prev => ({ ...prev, [task._id]: null }));
    
    try {
      const result = await deleteTask(task._id);
      
      if (result.success) {
        setMessages(prev => ({ 
          ...prev, 
          [task._id]: { type: 'success', text: 'Task deleted successfully!' }
        }));
        
        // Refresh the page after successful deletion
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setMessages(prev => ({ 
          ...prev, 
          [task._id]: { type: 'error', text: result.error }
        }));
      }
    } catch (err) {
      setMessages(prev => ({ 
        ...prev, 
        [task._id]: { type: 'error', text: 'Failed to delete task' }
      }));
    } finally {
      setLoadingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(task._id);
        return newSet;
      });
      setDeleteModal({ isOpen: false, task: null });
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const isLoading = loadingTasks.has(task._id);
        const message = messages[task._id];
        const currentStatus = taskStatuses[task._id];

        return (
          <div
            key={task._id}
            className="bg-white rounded-xl shadow-sm p-5 border border-orange-100"
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
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}>
                  {currentStatus?.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Status & Error Messages */}
            {message && (
              <div className={`mb-3 p-2 rounded text-sm ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            {/* People Info */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <span className="block text-xs text-gray-400">Assigned To</span>
                <span className="font-medium">{task.assignedTo?.name || 'Unassigned'}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400">Created By</span>
                <span className="font-medium">{task.createdBy?.name || 'Unknown'}</span>
              </div>
            </div>

            {/* Attachments */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Paperclip className="w-4 h-4 text-orange-500" />
              <span>{task.attachments?.length || 0} Document{task.attachments?.length === 1 ? '' : 's'}</span>
            </div>

            {/* Management Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {/* Status Update Buttons */}
              <div className="flex gap-2">
                {['pending', 'in-progress', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(task._id, status)}
                    disabled={isLoading || status === currentStatus}
                    className={`
                      px-3 py-1 rounded text-xs font-medium transition-colors
                      ${status === currentStatus 
                        ? 'bg-orange-200 text-orange-800 cursor-not-allowed' 
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {status.replace('-', ' ').toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteClick(task)}
                disabled={isLoading}
                className={`
                  p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                Processing...
              </div>
            )}
          </div>
        );
      })}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, task: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteModal.task?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}