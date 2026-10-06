import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { PaymentMethod, Session } from '../core/models';
import { ApiErrorComponent, LoadingComponent, apiErrorMessage } from '../shared/ui';

@Component({
  standalone: true,
  imports: [DatePipe, FormsModule, NgIf, RouterLink, ApiErrorComponent, LoadingComponent],
  template: `
    <section class="section-wrap detail-wrap">
      <a class="back-link" routerLink="/sessions">← All sessions</a>
      <bliss-loading *ngIf="loading" message="Opening session details…" />
      <bliss-api-error *ngIf="error" [message]="error" />
      <article class="detail-layout" *ngIf="session && !loading">
        <div>
          <div class="detail-photo" [style.backgroundImage]="session.image_url ? 'url(' + session.image_url + ')' : null"><span class="photo-label">{{ session.category }}</span></div>
          <div class="detail-copy"><span class="eyebrow">A PRACTICE FOR YOU</span><h1>{{ session.title }}</h1><p>{{ session.description }}</p><div class="instructor-note"><span class="instructor-initial">{{ session.instructor.charAt(0) }}</span><span>Guided by<strong>{{ session.instructor }}</strong></span></div></div>
        </div>
        <aside class="booking-card">
          <span class="eyebrow">MAKE IT YOURS</span><h2>Save your spot.</h2>
          <div class="booking-facts"><div><span>When</span><strong>{{ session.start_time | date:'EEEE, MMMM d · h:mm a' }}</strong></div><div><span>Where</span><strong>{{ session.location }}</strong></div><div><span>Duration</span><strong>{{ session.duration_minutes }} minutes</strong></div><div><span>Availability</span><strong>{{ session.spots_left }} spots left</strong></div></div>
          <div class="booking-price">GH₵{{ session.price }} <span>/ person</span></div>
          <div class="payment-picker">
            <label for="payment-method">Payment preference</label>
            <select id="payment-method" [(ngModel)]="paymentMethod"><option value="mobile_money">Mobile money</option><option value="card">Card</option><option value="cash">Cash</option></select>
            <small>This records your preference only. No payment details are collected here.</small>
          </div>
          <bliss-api-error *ngIf="bookingError" [message]="bookingError" title="Booking not completed" />
          <p class="booking-confirmation" *ngIf="bookingSuccess">Your booking request was received. Check My space for your booking.</p>
          <button class="button button-full" [disabled]="bookingLoading || session.spots_left < 1" (click)="book()">{{ bookingLoading ? 'Booking…' : session.spots_left < 1 ? 'Fully booked' : 'Book this session' }} <span>↗</span></button>
          <p class="login-hint" *ngIf="!auth.isAuthenticated">You’ll be asked to log in before booking. <a routerLink="/login" [queryParams]="{returnUrl: currentUrl}">Log in</a></p>
        </aside>
      </article>
    </section>
  `
})
export class SessionDetailPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  session: Session | null = null;
  loading = true;
  error = '';
  bookingLoading = false;
  bookingError = '';
  bookingSuccess = false;
  paymentMethod: PaymentMethod = 'mobile_money';
  currentUrl = '';

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.api.sessions().subscribe({
      next: sessions => {
        this.session = sessions.find(item => String(item.id) === id) ?? null;
        if (!this.session) this.error = 'This session could not be found. It may no longer be available.';
        this.loading = false;
      },
      error: error => { this.error = apiErrorMessage(error); this.loading = false; }
    });
  }

  book(): void {
    if (!this.session) return;
    if (!this.auth.isAuthenticated) {
      void this.router.navigate(['/login'], { queryParams: { returnUrl: this.currentUrl } });
      return;
    }
    this.bookingLoading = true;
    this.bookingError = '';
    this.bookingSuccess = false;
    this.api.createBooking(this.session.id, this.paymentMethod).subscribe({
      next: () => { this.bookingSuccess = true; this.bookingLoading = false; },
      error: error => { this.bookingError = apiErrorMessage(error); this.bookingLoading = false; }
    });
  }
}
