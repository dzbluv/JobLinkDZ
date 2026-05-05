type AuthRole = 'candidate' | 'admin';

export declare function resolveRoleFromAuthUser(sessionUser: any): AuthRole;
export declare function buildFallbackUser(
  sessionUser: any,
  emailOverride?: string
): {
  id: string;
  full_name: string;
  email: string;
  role: AuthRole;
} | null;
