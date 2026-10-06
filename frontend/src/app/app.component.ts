import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'bliss-root',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" routerLink="/" aria-label="Bliss Mind home">
          <span class="brand-mark">b</span><span>bliss<span class="brand-light">mind</span></span>
        </a>
        <nav class="desktop-nav" aria-label="Main navigation">
          <a routerLink="/sessions" routerLinkActive="nav-active">Explore</a>
          <a routerLink="/articles" routerLinkActive="nav-active">The journal</a>
          <a routerLink="/instructors/apply" routerLinkActive="nav-active">Teach with us</a>
        </nav>
        <div class="nav-actions">
          <ng-container *ngIf="auth.user$ | async as user; else signedOut">
            <a class="nav-dashboard" routerLink="/dashboard">My space</a>
            <button class="button button-small button-outline" (click)="logout()">Sign out</button>
          </ng-container>
          <ng-template #signedOut>
            <a class="nav-login" routerLink="/login">Log in</a>
            <a class="button button-small" routerLink="/register">Join Bliss</a>
          </ng-template>
        </div>
      </div>
    </header>
    <main><router-outlet /></main>
    <footer class="site-footer">
      <div class="footer-main">
        <div class="footer-brand">
          <a class="brand brand-inverse" routerLink="/"><span class="brand-mark">b</span><span>bliss<span class="brand-light">mind</span></span></a>
          <p>A little more room to feel like yourself.</p>
        </div>
        <div class="footer-links"><span class="eyebrow">Explore</span><a routerLink="/sessions">Find a session</a><a routerLink="/articles">Daily wellness</a></div>
        <div class="footer-links"><span class="eyebrow">Be part of it</span><a routerLink="/instructors/apply">Become an instructor</a><a routerLink="/register">Create an account</a></div>
      </div>
      <div class="footer-bottom"><span>© 2025 Bliss Mind</span><span>Made for your wellbeing.</span></div>
    </footer>
  `
})
export class AppComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.auth.isAuthenticated) {
      this.auth.restoreSession().subscribe({
        error: error => {
          if (error instanceof HttpErrorResponse && error.status === 401) this.auth.logout();
        }
      });
    }
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/']);
  }
}
