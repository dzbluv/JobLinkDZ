const VALID_ROLES = new Set(['candidate', 'admin']);

export function resolveRoleFromAuthUser(sessionUser) {
  const authRole =
    sessionUser?.user_metadata?.role ??
    sessionUser?.app_metadata?.role;

  return VALID_ROLES.has(authRole) ? authRole : 'candidate';
}

export function buildFallbackUser(sessionUser, emailOverride) {
  const id = sessionUser?.id;
  const email = emailOverride ?? sessionUser?.email;

  if (!id || !email) {
    return null;
  }

  const fullName =
    sessionUser?.user_metadata?.full_name ??
    sessionUser?.user_metadata?.name ??
    'Anonymous';

  return {
    id,
    full_name: fullName,
    email,
    role: resolveRoleFromAuthUser(sessionUser),
  };
}
