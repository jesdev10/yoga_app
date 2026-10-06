export interface User {
  id: number | string;
  full_name: string;
  email: string;
  role: string;
}

export interface Session {
  id: number | string;
  title: string;
  category: string;
  description: string;
  instructor: string;
  location: string;
  start_time: string;
  duration_minutes: number;
  price: number;
  capacity: number;
  booked_count: number;
  spots_left: number;
  image_url: string | null;
}

export type PaymentMethod = 'mobile_money' | 'card' | 'cash';

export interface Booking {
  id: number | string;
  session_id: number | string;
  status?: string;
  created_at?: string;
  session?: Session;
  session_title?: string;
  start_time?: string;
  location?: string;
  price?: number;
}

export interface Article {
  id: number | string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  category: string;
  author: string;
  published_at: string;
  image_url: string | null;
}

export interface Notification {
  id: number | string;
  title?: string;
  message?: string;
  body?: string;
  is_read?: boolean;
  read?: boolean;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface InstructorApplication {
  full_name: string;
  email: string;
  phone: string;
  discipline: string;
  experience_years: number;
  bio: string;
  cv_url: string;
}
