// components/FilterControls.js
'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current filter values
  const currentStatus = searchParams.get('status') || 'all';
  const currentPriority = searchParams.get('priority') || 'all';
  
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    
    if (value === 'all') {
      // Remove the parameter if 'all' is selected
      params.delete(key);
    } else {
      // Set the new filter value
      params.set(key, value);
    }
    
    // Navigate to the new URL with updated filters
    router.push(`/tasks?${params.toString()}`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold text-orange-700 mb-4">Filter Tasks</h3>
      
      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            value={currentStatus}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        {/* Priority Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select 
            value={currentPriority}
            onChange={(e) => updateFilter('priority', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        {/* Clear All Filters Button */}
        {(currentStatus !== 'all' || currentPriority !== 'all') && (
          <div className="flex flex-col justify-end">
            <button
              onClick={() => router.push('/tasks')}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Show active filters */}
      <div className="mt-3 text-xs text-gray-500">
        Active filters: 
        <span className="font-medium">
          {currentStatus !== 'all' ? ` Status: ${currentStatus}` : ''}
          {currentPriority !== 'all' ? ` Priority: ${currentPriority}` : ''}
          {currentStatus === 'all' && currentPriority === 'all' ? ' None' : ''}
        </span>
      </div>
    </div>
  );
}