export type role = "admin" | "teacher" | "student";
export interface IUser {
  id?: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: role;
  school_id?: number;
  is_onboarded?: boolean;
  password?: string;
  created_at?: string;
  updated_at?: string;
}
