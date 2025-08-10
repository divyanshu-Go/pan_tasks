import { cookies } from "next/headers";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://pan-tasks.vercel.app";

export async function getUserProfile() {
  const cookieStore = await cookies(); // 🟢 This reads cookies on the server
  const token = cookieStore.get("auth_token")?.value ;

  if (!token) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/api/user/profile`, {
    method: "GET",
    headers: {
      Cookie: `auth_token=${token}`, // 🟢 Pass the cookie to the backend API
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.user) {
    console.error("User fetch failed. API responded with: " + (json.message || "Unknown error"));
  }

  return json.user;
}





/**
 * Get all users (Admin only)
 */
export async function getAllUsers() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || '';

  // if (!token) {
  //   return null;
  // }

  const res = await fetch(`${BASE_URL}/api/user`, {
    method: "GET",
    headers: {
      Cookie: `auth_token=${token}`,
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok || !json.users) {
    console.error(
      "Fetch all users failed. API responded with: " +
        (json.error || json.message || "Unknown error")
    );
    return null;
  }

  return json.users;
}

/**
 * Get a specific user by ID (Admin only)
 */
export async function getUserById(id) {
  if (!id) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/api/user/${id}`, {
    method: "GET",
    headers: {
      Cookie: `auth_token=${token}`,
    },
    cache: "no-store",
  });

  const json = await res.json();
  console.log(json);

  if (!res.ok || !json.user) {
    console.error(
      `Fetch user ${id} failed. API responded with: ` +
        (json.error || json.message || "Unknown error")
    );
    return null;
  }

  return json.user;
}






//serverside fetching , /lib/api/api.js
export async function getAllTasks(filters = {}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    // Build query string from filters
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') {
      params.set('status', filters.status);
    }
    if (filters.priority && filters.priority !== 'all') {
      params.set('priority', filters.priority);
    }
    
    const queryString = params.toString();
    const url = `${BASE_URL}/api/tasks${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔍 Server: Fetching tasks with URL:', url);
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add auth token if available
    if (token) {
      headers.Cookie = `auth_token=${token}`;
    }
    
    const res = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store", // Always get fresh data
    });
    
    const json = await res.json();
    
    if (!res.ok) {
      console.error(`❌ Server: Tasks fetch failed. Status: ${res.status}, Message: ${json.message || json.error || 'Unknown error'}`);
      return {
        error: json.error || 'Failed to fetch tasks',
        status: res.status
      };
    }
    
    console.log(`✅ Server: Successfully fetched ${json.tasks?.length || 0} tasks with filters:`, json.appliedFilters);
    
    return {
      success: true,
      tasks: json.tasks || [],
      count: json.count || json.tasks?.length || 0,
      message: json.message,
      appliedFilters: json.appliedFilters || {}
    };
    
  } catch (error) {
    console.error('❌ Server: Network error fetching tasks:', error);
    return {
      error: 'Network error while fetching tasks',
      details: error.message
    };
  }
}


export async function getTaskById(taskId) {
  try {
    // Validate taskId
    if (!taskId || typeof taskId !== 'string') {
      console.error('❌ Server: Invalid task ID provided');
      return {
        error: 'Invalid task ID provided',
        status: 400
      };
    }
    
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    console.log(`🔍 Server: Fetching task with ID: ${taskId}`);
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add auth token if available
    if (token) {
      headers.Cookie = `auth_token=${token}`;
    }
    
    const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
      method: "GET",
      headers,
      cache: "no-store", // Always get fresh data
    });
    
    const json = await res.json();
    
    if (!res.ok) {
      console.error(`❌ Server: Task fetch failed. Status: ${res.status}, Message: ${json.message || json.error || 'Unknown error'}`);
      return {
        error: json.error || 'Failed to fetch task',
        status: res.status
      };
    }
    
    console.log(`✅ Server: Successfully fetched task: ${json.task?.title || 'Unknown title'}`);
    
    return {
      success: true,
      task: json.task,
      message: json.message
    };
    
  } catch (error) {
    console.error('❌ Server: Network error fetching task:', error);
    return {
      error: 'Network error while fetching task',
      details: error.message
    };
  }
}