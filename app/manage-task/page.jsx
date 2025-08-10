// app/manage-task/page.js
import ManageTasksList from '@/components/ManageTasksList';
import FilterControls from '@/components/FilterControls';
import { getAllTasks } from '@/lib/api/api';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ManageTasksPage({ searchParams }) {
  // Await searchParams in Next.js 15+
  const params = await searchParams;
  
  // Extract filter parameters from URL search params
  const filters = {
    status: params?.status || 'all',
    priority: params?.priority || 'all'
  };

  console.log('🔍 Manage Tasks Page: Applied filters:', filters);

  const tasksResult = await getAllTasks(filters);

  if (!tasksResult.success) {
    return (
      <div className="min-h-screen bg-orange-50 py-8">
        <div className="container mx-auto px-4">
          <Link 
            href="/tasks" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tasks
          </Link>

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
          <Link 
            href="/tasks" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tasks
          </Link>
          
          <h1 className="text-3xl font-bold text-orange-700">Manage Tasks</h1>
          <p className="text-gray-600 text-sm mt-1">
            {count} task{count !== 1 ? 's' : ''} available for management
          </p>
        </div>

        {/* Filter Controls */}
        <FilterControls />

        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl text-gray-600 mb-4">No tasks available.</h2>
              {(filters.status !== 'all' || filters.priority !== 'all') && (
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              )}
            </div>
          </div>
        ) : (
          <ManageTasksList tasks={tasks} />
        )}
      </div>
    </div>
  );
}