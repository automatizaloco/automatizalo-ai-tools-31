
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'client';
  created_at: string;
  updated_at: string;
}
