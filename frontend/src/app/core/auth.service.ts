import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, User } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly tokenKey = 'bliss_mind_access_token';
  private readonly userSubject = new BehaviorSubject<User | null>(null);
  readonly user$ = this.userSubject.asObservable();

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    return Boolean(this.token);
  }

  restoreSession(): Observable<User> {
    return this.api.me().pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.api.login({ email, password }).pipe(tap(response => this.accept(response)));
  }

  register(full_name: string, email: string, password: string): Observable<AuthResponse> {
    return this.api.register({ full_name, email, password }).pipe(tap(response => this.accept(response)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  private accept(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.access_token);
    this.userSubject.next(response.user);
  }
}
