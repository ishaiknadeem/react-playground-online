
interface JWTPayload {
  id: string;
  email: string;
  role: string;
  name?: string;
  organizationId?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  aud?: string;
}

export const isValidJWT = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Validate each part can be base64 decoded
    parts.forEach(part => {
      if (!part) throw new Error('Invalid token part');
      atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    });

    return true;
  } catch (error) {
    console.warn('Invalid JWT format:', error);
    return false;
  }
};

export const decodeJWT = (token: string): JWTPayload | null => {
  if (!isValidJWT(token)) {
    return null;
  }

  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const parsed = JSON.parse(decodedPayload) as JWTPayload;

    // Validate required fields
    if (!parsed.id || !parsed.email || !parsed.role) {
      console.warn('JWT missing required fields');
      return null;
    }

    // Validate role
    if (!['admin', 'examiner', 'candidate'].includes(parsed.role)) {
      console.warn('Invalid role in JWT:', parsed.role);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // Add 30 second buffer to account for clock skew
  const currentTime = Math.floor(Date.now() / 1000) + 30;
  return payload.exp < currentTime;
};

export const getTokenExpirationTime = (token: string): Date | null => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return null;
  }

  return new Date(payload.exp * 1000);
};

export const validateTokenStructure = (token: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!token) {
    errors.push('Token is required');
    return { isValid: false, errors };
  }

  if (typeof token !== 'string') {
    errors.push('Token must be a string');
    return { isValid: false, errors };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    errors.push('Token must have 3 parts separated by dots');
    return { isValid: false, errors };
  }

  try {
    // Validate header
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    if (!header.alg || !header.typ) {
      errors.push('Invalid token header');
    }

    // Validate payload
    const payload = decodeJWT(token);
    if (!payload) {
      errors.push('Invalid token payload');
    } else {
      if (isTokenExpired(token)) {
        errors.push('Token is expired');
      }
    }
  } catch (error) {
    errors.push('Token structure is malformed');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Utility to safely extract user info from token
export const extractUserFromToken = (token: string) => {
  const payload = decodeJWT(token);
  if (!payload) return null;

  return {
    id: payload.id,
    email: payload.email,
    role: payload.role,
    name: payload.name || '',
  };
};
