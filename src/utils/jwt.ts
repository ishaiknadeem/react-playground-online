
interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: 'admin' | 'examiner' | 'candidate';
  organizationId?: string;
  exp: number;
  iat?: number;
}

export const validateToken = (token: string): JWTPayload | null => {
  try {
    if (!token || typeof token !== 'string') {
      console.log('JWT Validation: Invalid token format');
      return null;
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/, '');
    
    // Basic JWT structure validation
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      console.log('JWT Validation: Invalid token structure');
      return null;
    }

    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    console.log('JWT Validation: Token payload decoded:', payload);
    
    // Validate required fields
    if (!payload.sub || !payload.email || !payload.role || !payload.exp) {
      console.log('JWT Validation: Missing required fields');
      return null;
    }

    // Check expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      console.log('JWT Validation: Token expired');
      return null;
    }

    // Validate role
    const validRoles = ['admin', 'examiner', 'candidate'];
    if (!validRoles.includes(payload.role)) {
      console.log('JWT Validation: Invalid role');
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      organizationId: payload.organizationId,
      exp: payload.exp,
      iat: payload.iat
    };
  } catch (error) {
    console.error('JWT Validation: Token validation failed:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = validateToken(token);
  return !payload;
};

export const getTokenPayload = (token: string): JWTPayload | null => {
  return validateToken(token);
};
