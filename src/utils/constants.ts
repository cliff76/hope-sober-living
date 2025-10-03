export const ROLES_ADMIN = 'admin';
export const ROLES_EMPLOYEE = 'employee';
export const ROLES_RESIDENT = 'resident';
export const DEFAULT_ROLES = [ROLES_RESIDENT];
export type SaveError = {
    code: string;
    message: string;
    field?: string;
};