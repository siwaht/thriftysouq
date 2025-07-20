// Ultra-simple session-based authentication API

export async function loginAdmin(username: string, password: string) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include', // Essential for cookie-based sessions
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Login failed');
  }

  const data = await response.json();
  console.log('Login successful');
  
  // Store session ID in localStorage as backup
  if (data.sessionId) {
    localStorage.setItem('adminSessionId', data.sessionId);
  }
  
  return data;
}

export async function checkAuthStatus() {
  // Get session ID from localStorage as backup
  const storedSessionId = localStorage.getItem('adminSessionId');
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
  };
  
  // Add authorization header if we have a session ID
  if (storedSessionId) {
    headers['Authorization'] = `Bearer ${storedSessionId}`;
  }
  
  const response = await fetch('/api/admin/auth-status', {
    method: 'GET',
    headers,
    credentials: 'include', // Check cookies
  });

  if (!response.ok) {
    console.error('Auth check failed');
    localStorage.removeItem('adminSessionId');
    return { isAuthenticated: false };
  }

  const data = await response.json();
  console.log('Auth status:', data.isAuthenticated ? 'authenticated' : 'not authenticated');
  
  return data;
}

export async function logoutAdmin() {
  const response = await fetch('/api/admin/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (response.ok) {
    console.log('Logout successful');
    localStorage.removeItem('adminSessionId');
  }

  return response.ok;
}