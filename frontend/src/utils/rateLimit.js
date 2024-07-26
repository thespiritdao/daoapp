// Debounce function to limit the rate of function calls
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function to limit the rate of function calls
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Rate limiter class for more complex rate limiting scenarios
export class RateLimiter {
  constructor(limit, interval) {
    this.limit = limit;
    this.interval = interval;
    this.tokens = limit;
    this.lastRefill = Date.now();
  }

  canMakeRequest() {
    this.refillTokens();
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }

  refillTokens() {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const refill = Math.floor(timePassed / this.interval);
    if (refill > 0) {
      this.tokens = Math.min(this.limit, this.tokens + refill);
      this.lastRefill = now;
    }
  }
}

// Example usage:
// const apiRateLimiter = new RateLimiter(5, 10000); // 5 requests per 10 seconds
// if (apiRateLimiter.canMakeRequest()) {
//   // Make API call
// } else {
//   console.log('Rate limit exceeded. Please try again later.');
// }