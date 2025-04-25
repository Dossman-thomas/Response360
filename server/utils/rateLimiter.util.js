// Utility functions for rate limiting login attempts
const loginAttempts = new Map();

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

export const checkRateLimit = (key) => {
  const now = Date.now();
  const attemptData = loginAttempts.get(key) || { count: 0, lastAttempt: now };

  if (now - attemptData.lastAttempt > WINDOW_MINUTES * 60 * 1000) {
    // Reset the attempt count after time window has passed
    loginAttempts.set(key, { count: 1, lastAttempt: now });
    return;
  }

  if (attemptData.count >= MAX_ATTEMPTS) {
    const error = new Error(`Too many login attempts. Try again in ${WINDOW_MINUTES} minutes.`);
    error.status = 429;
    throw error;
  }

  // Otherwise, increment count
  loginAttempts.set(key, {
    count: attemptData.count + 1,
    lastAttempt: now,
  });
};

export const resetRateLimit = (key) => {
  loginAttempts.delete(key);
};
