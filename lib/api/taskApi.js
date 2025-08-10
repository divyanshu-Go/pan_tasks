// lib/api/taskApi.js - Client-side API functions
export async function updateTaskStatus(taskId, status) {
  try {
    console.log('🔄 Updating task status:', { taskId, status });
    
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update task status');
    }
    
    console.log('✅ Task status updated successfully');
    return { success: true, task: data.task };
    
  } catch (error) {
    console.error('❌ Error updating task status:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteTask(taskId) {
  try {
    console.log('🗑️ Deleting task:', taskId);
    
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete task');
    }
    
    console.log('✅ Task deleted successfully');
    return { success: true, deletedTask: data.deletedTask };
    
  } catch (error) {
    console.error('❌ Error deleting task:', error);
    return { success: false, error: error.message };
  }
}

export async function getTaskById(taskId) {
  try {
    console.log('📋 Fetching task:', taskId);
    
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'GET',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch task');
    }
    
    console.log('✅ Task fetched successfully');
    return { success: true, task: data.task };
    
  } catch (error) {
    console.error('❌ Error fetching task:', error);
    return { success: false, error: error.message };
  }
}