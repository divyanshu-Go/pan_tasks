import TasksList from '@/components/TasksList';
import { getAllTasks } from '@/lib/api/api';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default async function TasksSSRPage() {
  const tasksResult = await getAllTasks();

  if (!tasksResult.success) {
    return (
      <div className="min-h-screen bg-orange-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <div>
              <h2 className="font-bold">Error Loading Tasks</h2>
              <p>{tasksResult.error}</p>
              {tasksResult.status && (
                <p className="text-sm">Status: {tasksResult.status}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { tasks, count } = tasksResult;

  return (
    <div className="min-h-screen bg-orange-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-700">All Tasks</h1>
          <p className="text-gray-600 text-sm mt-1">
            {count} task{count !== 1 ? 's' : ''} found
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl text-gray-600 mb-4">No tasks available.</h2>
            </div>
          </div>
        ) : (
          <TasksList tasks={tasks} />
        )}
      </div>
    </div>
  );
}
