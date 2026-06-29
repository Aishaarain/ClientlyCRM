export const ROLES = {
  ADMIN: "admin",
  FREELANCER: "freelancer",
  MEMBER: "member",
};

export const WORKER_ROLES = [ROLES.FREELANCER, ROLES.MEMBER];

export const ALL_APP_ROLES = [ROLES.ADMIN, ROLES.FREELANCER, ROLES.MEMBER];

export const isAdmin = (user) => user?.role === ROLES.ADMIN;

export const isWorker = (user) => WORKER_ROLES.includes(user?.role);

export const canManageClients = (user) => isAdmin(user);

export const canManageProjects = (user) => isAdmin(user);

export const canManageTasks = (user) => isAdmin(user);

export const canViewAssignedWork = (user) =>
  ALL_APP_ROLES.includes(user?.role);