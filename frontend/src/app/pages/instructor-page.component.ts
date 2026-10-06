import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { ApiErrorComponent, apiErrorMessage } from '../shared/ui';

@Component({
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, ApiErrorComponent],
  template: `
    <section class="page-hero instructor-hero"><div class="page-hero-inner"><span class="eyebrow">SHARE WHAT YOU LOVE</span><h1>Teach with<br><em>heart.</em></h1><p>Bring your practice to a community making more room for wellbeing.</p></div><div class="page-hero-orbit">↟</div></section>
    <section class="section-wrap instructor-section">
      <div class="instructor-intro"><span class="eyebrow">YOUR PRACTICE HAS A PLACE HERE</span><h2>Good things grow<br>when we share them.</h2><p>Tell us a little about yourself and the practice you bring. Our team will be in touch about what comes next.</p><div class="instructor-note">✳ &nbsp; Thoughtful people. Welcoming spaces. Room to grow.</div></div>
      <div class="instructor-form-card">
        <span class="eyebrow">INSTRUCTOR APPLICATION</span><h2>Let's get to know you.</h2>
        <bliss-api-error *ngIf="error" [message]="error" title="Your application wasn't sent" />
        <div class="success-notice" *ngIf="success">Thanks for sharing your practice with us. Your application was submitted.</div>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="form-grid"><label>Full name<input formControlName="full_name" autocomplete="name" placeholder="Your name"></label><label>Email address<input type="email" formControlName="email" autocomplete="email" placeholder="you@example.com"></label></div>
          <div class="form-grid"><label>Phone number<input type="tel" formControlName="phone" autocomplete="tel" placeholder="+233…"></label><label>Practice / discipline<input formControlName="discipline" placeholder="Yoga, meditation…"></label></div>
          <label>Years of experience<input type="number" formControlName="experience_years" min="0" max="80" placeholder="e.g. 5"></label>
          <label>A little about you<textarea formControlName="bio" rows="5" placeholder="Tell us about your journey, your approach, and what you love about teaching."></textarea></label>
          <label>CV or portfolio link <span class="optional">(optional)</span><input type="url" formControlName="cv_url" placeholder="https://"></label>
          <button class="button button-full" type="submit" [disabled]="form.invalid || submitting">{{ submitting ? 'Sending your application…' : 'Send application' }} <span>↗</span></button>
        </form>
        <p class="form-footnote">Please share a link accessible to our team. No documents or payments are collected on this page.</p>
      </div>
    </section>
  `
})
export class InstructorPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  submitting = false;
  success = false;
  error = '';
  form = this.fb.nonNullable.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    discipline: ['', [Validators.required]],
    experience_years: [0, [Validators.required, Validators.min(0)]],
    bio: ['', [Validators.required, Validators.minLength(20)]],
    cv_url: ['', [Validators.pattern(/^$|https?:\/\/.+/)]]
  });

  submit(): void {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;
    this.error = '';
    this.success = false;
    this.api.applyAsInstructor(this.form.getRawValue()).subscribe({
      next: () => { this.success = true; this.submitting = false; this.form.reset({ full_name: '', email: '', phone: '', discipline: '', experience_years: 0, bio: '', cv_url: '' }); },
      error: error => { this.error = apiErrorMessage(error); this.submitting = false; }
    });
  }
}
