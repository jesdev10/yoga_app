import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Article, AuthResponse, Booking, InstructorApplication, Notification,
  PaymentMethod, Session, User
} from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = 'http://localhost:8000';

  sessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/api/sessions`);
  }

  register(payload: { full_name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/auth/register`, payload);
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/auth/login`, payload);
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/api/auth/me`);
  }

  createBooking(session_id: string | number, payment_method: PaymentMethod): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/api/bookings`, { session_id, payment_method });
  }

  myBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/api/bookings/me`);
  }

  cancelBooking(id: string | number): Observable<Booking> {
    return this.http.patch<Booking>(`${this.baseUrl}/api/bookings/${id}/cancel`, {});
  }

  articles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/api/articles`);
  }

  article(slug: string): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/api/articles/${encodeURIComponent(slug)}`);
  }

  applyAsInstructor(payload: InstructorApplication): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/api/instructor-applications`, payload);
  }

  notifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/api/notifications/me`);
  }

  markNotificationRead(id: string | number): Observable<Notification> {
    return this.http.patch<Notification>(`${this.baseUrl}/api/notifications/${id}/read`, {});
  }
}
