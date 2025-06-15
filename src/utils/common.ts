
export const isPublicRoute = (path: string): boolean => {
  const publicRoutes = ['/login', '/signup', '/candidate-login', '/candidate-signup', '/'];
  return publicRoutes.includes(path);
};
