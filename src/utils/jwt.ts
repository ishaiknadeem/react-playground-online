
export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: 'admin' | 'examiner' | 'candidate';
  organizationId?: string;
  exp: number;
}

export const validateToken = (token: string): JWTPayload | null => {
  if (!token) {
    console.log('JWT Validation: No token provided');
    return null;
  }

  try {
    // Handle both real JWT (3 parts) and mock tokens (base64 encoded JSON)
    const parts = token.split('.');
    
    if (parts.length === 3) {
      // Real JWT format
      console.log('JWT Validation: Processing real JWT token');
      const payload = JSON.parse(atob(parts[1]));
      
      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        console.log('JWT Validation: Token expired');
        return null;
      }
      
      return payload;
    } else if (parts.length === 1) {
      // Mock token format (base64 encoded JSON)
      console.log('JWT Validation: Processing mock token');
      const payload = JSON.parse(atob(token));
      
      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        console.log('JWT Validation: Mock token expired');
        return null;
      }
      
      console.log('JWT Validation: Mock token valid:', payload);
      return payload;
    } else {
      console.log('JWT Validation: Invalid token structure');
      return null;
    }
  } catch (error) {
    console.error('JWT Validation: Error parsing token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = validateToken(token);
  return !payload;
};
