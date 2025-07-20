// Session utilities for debugging and managing authentication state

export function logSessionDebug() {
  console.log("=== Session Debug Info ===");
  console.log("Document cookies:", document.cookie);
  console.log("Location:", window.location.href);
  console.log("Origin:", window.location.origin);
  console.log("User Agent:", navigator.userAgent);
  
  // Check for our session cookie specifically
  const cookies = document.cookie.split(';');
  const thriftyCookie = cookies.find(cookie => cookie.trim().startsWith('thrifty.sid='));
  console.log("ThriftySouq session cookie:", thriftyCookie || "NOT FOUND");
  console.log("========================");
}

export function clearAllCookies() {
  // Clear all cookies for this domain
  document.cookie.split(";").forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
  });
}

export function hasSessionCookie(): boolean {
  return document.cookie.includes('thrifty.sid=');
}