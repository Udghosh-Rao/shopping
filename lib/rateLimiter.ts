// Simple in-memory rate limiter for auth routes
// Maps IP address to request timestamps

interface RateLimitStore {
  [key: string]: number[];
}

const store: RateLimitStore = {};
const MAX_REQUESTS = 5; // Max 5 requests
const WINDOW_MS = 15 * 60 * 1000; // Per 15 minutes

export function getRateLimitKey(ip: string | null): string {
  return ip || 'unknown';
}

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const requests = store[key] || [];

  // Remove old requests outside the window
  const recentRequests = requests.filter(time => now - time < WINDOW_MS);

  if (recentRequests.length >= MAX_REQUESTS) {
    return true;
  }

  // Add current request
  store[key] = [...recentRequests, now];
  return false;
}

export function resetRateLimit(key: string): void {
  delete store[key];
}

// Cleanup old entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    const recentRequests = store[key].filter(time => now - time < WINDOW_MS);
    if (recentRequests.length === 0) {
      delete store[key];
    } else {
      store[key] = recentRequests;
    }
  }
}, 10 * 60 * 1000);
