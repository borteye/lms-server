export type role = "admin" | "teacher" | "student";
export interface IUser {
  id: number;
  name: string;
  email: string;
  role: role;
  school_id?: number;
  is_onboarded?: boolean;
  password?: string;
  created_at?: string;
  updated_at?: string;
}
