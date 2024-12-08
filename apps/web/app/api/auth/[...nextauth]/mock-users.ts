import { UserRole } from "@prisma/client";

export const mockUsers = [
  // Admins
  {
    id: "admin-1",
    email: "admin1@test.com",
    name: "Admin Premier",
    password: "admin123",
    role: "ADMIN" as UserRole,
    emailVerified: new Date(),
    clerkId: "clk_admin1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "admin-2",
    email: "admin2@test.com",
    name: "Admin Second",
    password: "admin123",
    role: "ADMIN" as UserRole,
    emailVerified: new Date(),
  },
  {
    id: "admin-3",
    email: "admin3@test.com",
    name: "Admin Troisième",
    password: "admin123",
    role: "ADMIN" as UserRole,
    emailVerified: new Date(),
  },

  // Mentors
  {
    id: "mentor-1",
    email: "mentor1@test.com",
    name: "Mentor Premier",
    password: "mentor123",
    role: "MENTOR" as UserRole,
    emailVerified: new Date(),
  },
  {
    id: "mentor-2",
    email: "mentor2@test.com",
    name: "Mentor Second",
    password: "mentor123",
    role: "MENTOR" as UserRole,
    emailVerified: new Date(),
  },
  {
    id: "mentor-3",
    email: "mentor3@test.com",
    name: "Mentor Troisième",
    password: "mentor123",
    role: "MENTOR" as UserRole,
    emailVerified: new Date(),
  },

  // Students
  {
    id: "student-1",
    email: "student1@test.com",
    name: "Étudiant Premier",
    password: "student123",
    role: "STUDENT" as UserRole,
    emailVerified: new Date(),
  },
  {
    id: "student-2",
    email: "student2@test.com",
    name: "Étudiant Second",
    password: "student123",
    role: "STUDENT" as UserRole,
    emailVerified: new Date(),
  },
  {
    id: "student-3",
    email: "student3@test.com",
    name: "Étudiant Troisième",
    password: "student123",
    role: "STUDENT" as UserRole,
    emailVerified: new Date(),
  },
];