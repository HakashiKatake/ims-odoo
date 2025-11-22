import { auth } from '@clerk/nextjs/server';

export type UserRole = 'admin' | 'staff';

export async function getCurrentUser() {
  const { userId } = await auth();
  return userId;
}

export async function getUserRole(): Promise<UserRole | null> {
  const { sessionClaims } = await auth();
  
  if (!sessionClaims) {
    return null;
  }

  return (sessionClaims.unsafeMetadata as { role?: UserRole })?.role || null;
}

export async function requireAuth() {
  const userId = await getCurrentUser();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  return userId;
}

export async function requireAdmin() {
  const userId = await requireAuth();
  const role = await getUserRole();
  
  if (role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return userId;
}

export async function checkPermission(requiredRole: UserRole): Promise<boolean> {
  const role = await getUserRole();
  
  if (!role) {
    return false;
  }
  
  if (requiredRole === 'staff') {
    return role === 'admin' || role === 'staff';
  }
  
  return role === requiredRole;
}
