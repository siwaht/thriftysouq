// Specialized API functions for authentication with enhanced error handling

export async function loginAdmin(username: string, password: string) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include', // For cookie storage
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Login failed');
  }

  const data = await response.json();
  console.log('Login successful, response:', data);
  
  // Store token in localStorage as backup
  if (data.token) {
    localStorage.setItem('adminToken', data.token);
    console.log('Token stored in localStorage:', data.token);
  }
  
  // Check cookies after login
  console.log('Cookies after login:', document.cookie);
  
  return data;
}

export async function checkAuthStatus() {
  // Get token from localStorage as backup
  const storedToken = localStorage.getItem('adminToken');
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
  };
  
  // Add authorization header if we have a token
  if (storedToken) {
    headers['Authorization'] = `Bearer ${storedToken}`;
  }
  
  const response = await fetch('/api/admin/auth-status', {
    method: 'GET',
    headers,
    credentials: 'include', // Also check cookies
  });

  if (!response.ok) {
    console.error('Auth check failed:', response.status, response.statusText);
    // Clear invalid token
    localStorage.removeItem('adminToken');
    return { isAuthenticated: false };
  }

  const data = await response.json();
  console.log('Auth status response:', data);
  console.log('Current cookies:', document.cookie);
  console.log('Stored token:', storedToken ? 'present' : 'missing');
  
  return data;
}

export async function logoutAdmin() {
  const storedToken = localStorage.getItem('adminToken');
  const headers: Record<string, string> = {};
  
  if (storedToken) {
    headers['Authorization'] = `Bearer ${storedToken}`;
  }
  
  const response = await fetch('/api/admin/logout', {
    method: 'POST',
    headers,
    credentials: 'include',
  });

  if (response.ok) {
    console.log('Logout successful');
    // Clear client-side auth data
    localStorage.removeItem('adminToken');
  }

  return response.ok;
}