import { Component, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ApiErrorComponent, apiErrorMessage } from '../shared/ui';

@Component({
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink, ApiErrorComponent],
  template: `
    <section class="auth-page">
      <div class="auth-visual"><div class="auth-visual-content"><span class="eyebrow">A LITTLE SPACE, JUST FOR YOU</span><blockquote>“Taking care of yourself is how you give the world the best of you.”</blockquote><span class="quote-credit">Come as you are. Start where you are.</span></div><div class="auth-visual-caption">Breathe in. Begin again.</div></div>
      <div class="auth-form-side">
        <div class="auth-form-wrap">
          <span class="eyebrow">{{ mode === 'login' ? 'WELCOME BACK' : 'A GOOD PLACE TO BEGIN' }}</span>
          <h1>{{ mode === 'login' ? 'Your space awaits.' : 'Let’s make room.' }}</h1>
          <p>{{ mode === 'login' ? 'Pick up right where you left yourself.' : 'Create an account and find your next feel-good.' }}</p>
          <bliss-api-error *ngIf="error" [message]="error" title="We couldn't {{ mode === 'login' ? 'log you in' : 'create your account' }}" />
          <form [formGroup]="form" (ngSubmit)="submit()">
            <label *ngIf="mode === 'register'">Full name<input type="text" formControlName="full_name" autocomplete="name" placeholder="Your name"></label>
            <label>Email address<input type="email" formControlName="email" autocomplete="email" placeholder="you@example.com"></label>
            <label>Password<input type="password" formControlName="password" [autocomplete]="mode === 'login' ? 'current-password' : 'new-password'" placeholder="At least 8 characters"></label>
            <button class="button button-full auth-submit" type="submit" [disabled]="form.invalid || loading">{{ loading ? 'One moment…' : mode === 'login' ? 'Log in' : 'Create account' }} <span>↗</span></button>
          </form>
          <p class="auth-switch">{{ mode === 'login' ? 'New to Bliss Mind?' : 'Already have an account?' }} <a [routerLink]="mode === 'login' ? '/register' : '/login'">{{ mode === 'login' ? 'Join us' : 'Log in' }}</a></p>
          <a class="auth-back" routerLink="/">← Back to home</a>
        </div>
      </div>
    </section>
  `
})
export class AuthPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  mode: 'login' | 'register' = 'login';
  loading = false;
  error = '';
  returnUrl = '/dashboard';
  form = this.fb.nonNullable.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'] === 'register' ? 'register' : 'login';
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
    if (this.mode === 'login') this.form.controls.full_name.disable();
    else this.form.controls.full_name.enable();
  }

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = '';
    const value = this.form.getRawValue();
    const request = this.mode === 'login'
      ? this.auth.login(value.email, value.password)
      : this.auth.register(value.full_name, value.email, value.password);
    request.subscribe({
      next: () => { this.loading = false; void this.router.navigateByUrl(this.safeReturnUrl()); },
      error: error => { this.error = apiErrorMessage(error); this.loading = false; }
    });
  }

  private safeReturnUrl(): string {
    return this.returnUrl.startsWith('/') && !this.returnUrl.startsWith('//') ? this.returnUrl : '/dashboard';
  }
}
