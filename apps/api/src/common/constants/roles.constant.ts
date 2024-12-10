import { UserRole } from '@prisma/client';

export const ROLES = {
  STUDENT: UserRole.STUDENT,
  EXPERT: UserRole.EXPERT,
  ADMIN: UserRole.ADMIN,
} as const;
