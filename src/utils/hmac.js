// HMAC utility functions
let hmacSecret = null;

export const setHmacSecret = (secret) => {
  hmacSecret = secret;
  if (typeof window !== 'undefined') {
    localStorage.setItem('hmac_secret', secret);
  }
};

export const getHmacSecret = () => {
  if (hmacSecret) return hmacSecret;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('hmac_secret');
  }
  return null;
};

export const clearHmacSecret = () => {
  hmacSecret = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hmac_secret');
  }
};
