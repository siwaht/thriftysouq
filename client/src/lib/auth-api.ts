// Specialized API functions for authentication with enhanced error handling

export async function loginAdmin(username: string, password: string) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include', // Critical for cookie-based sessions
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Login failed');
  }

  const data = await response.json();
  console.log('Login successful, response:', data);
  
  // Force cookie check after login
  console.log('Cookies after login:', document.cookie);
  
  return data;
}

export async function checkAuthStatus() {
  const response = await fetch('/api/admin/auth-status', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
    },
    credentials: 'include', // Critical for cookie-based sessions
  });

  if (!response.ok) {
    console.error('Auth check failed:', response.status, response.statusText);
    return { isAuthenticated: false };
  }

  const data = await response.json();
  console.log('Auth status response:', data);
  console.log('Current cookies:', document.cookie);
  
  return data;
}

export async function logoutAdmin() {
  const response = await fetch('/api/admin/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (response.ok) {
    console.log('Logout successful');
    // Clear any client-side session data
    localStorage.clear();
    sessionStorage.clear();
  }

  return response.ok;
}