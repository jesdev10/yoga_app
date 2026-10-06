import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ApiService } from '../core/api.service';
import { Booking, Notification } from '../core/models';
import { ApiErrorComponent, EmptyComponent, LoadingComponent, apiErrorMessage } from '../shared/ui';

@Component({
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, RouterLink, ApiErrorComponent, EmptyComponent, LoadingComponent],
  template: `
    <section class="page-hero dashboard-hero"><div class="page-hero-inner"><span class="eyebrow">YOUR OWN LITTLE CORNER</span><h1>Hi, {{ firstName }}.<br><em>You're here.</em></h1><p>A place for your plans, reminders, and moments of care.</p></div><div class="page-hero-orbit">☼</div></section>
    <section class="section-wrap dashboard-content">
      <div class="dashboard-columns">
        <section class="dashboard-panel">
          <div class="panel-heading"><div><span class="eyebrow">MADE FOR YOUR CALENDAR</span><h2>Your bookings</h2></div><a routerLink="/sessions" class="text-link">Find a session <span>→</span></a></div>
          <bliss-loading *ngIf="bookingsLoading" message="Gathering your plans…" />
          <bliss-api-error *ngIf="bookingsError" [message]="bookingsError" />
          <bliss-empty *ngIf="!bookingsLoading && !bookingsError && !bookings.length" title="Your calendar has room to breathe" message="You don't have any bookings yet. Find something that feels good." />
          <div class="booking-list" *ngIf="!bookingsLoading && bookings.length">
            <article class="booking-row" *ngFor="let booking of bookings">
              <div class="booking-date"><span>{{ getBookingDate(booking) | date:'MMM' }}</span><strong>{{ getBookingDate(booking) | date:'d' }}</strong></div>
              <div class="booking-row-info"><span class="eyebrow">{{ booking.status || 'BOOKED' }}</span><h3>{{ booking.session?.title || booking.session_title || 'Wellness session' }}</h3><p>{{ getBookingDate(booking) | date:'EEEE, h:mm a' }} <span>·</span> {{ booking.session?.location || booking.location || 'Location details available with your booking' }}</p></div>
              <button class="button button-outline button-small" [disabled]="cancellingId === booking.id || isCancelled(booking)" (click)="cancelBooking(booking)">{{ isCancelled(booking) ? 'Cancelled' : cancellingId === booking.id ? 'Cancelling…' : 'Cancel' }}</button>
            </article>
          </div>
        </section>
        <section class="dashboard-panel notification-panel">
          <div class="panel-heading"><div><span class="eyebrow">A NOTE FOR YOU</span><h2>Notifications</h2></div><span class="notification-count" *ngIf="unreadCount">{{ unreadCount }} new</span></div>
          <bliss-loading *ngIf="notificationsLoading" message="Checking in…" />
          <bliss-api-error *ngIf="notificationsError" [message]="notificationsError" />
          <bliss-empty *ngIf="!notificationsLoading && !notificationsError && !notifications.length" title="All caught up" message="We'll leave a note here when there's something to share." />
          <div class="notification-list" *ngIf="!notificationsLoading && notifications.length">
            <article class="notification-row" *ngFor="let note of notifications" [class.unread]="!isRead(note)">
              <span class="notification-dot"></span><div><p>{{ note.message || note.body || note.title || 'A notification from Bliss Mind' }}</p><small *ngIf="note.created_at">{{ note.created_at | date:'medium' }}</small></div>
              <button class="text-link mark-read" *ngIf="!isRead(note)" [disabled]="markingId === note.id" (click)="markRead(note)">{{ markingId === note.id ? 'Saving…' : 'Mark read' }}</button>
            </article>
          </div>
        </section>
      </div>
    </section>
  `
})
export class DashboardPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  bookings: Booking[] = [];
  notifications: Notification[] = [];
  bookingsLoading = true;
  notificationsLoading = true;
  bookingsError = '';
  notificationsError = '';
  cancellingId: number | string | null = null;
  markingId: number | string | null = null;

  get firstName(): string {
    return this.auth.currentUser?.full_name.split(' ')[0] ?? 'friend';
  }
  get unreadCount(): number {
    return this.notifications.filter(note => !this.isRead(note)).length;
  }

  ngOnInit(): void {
    this.loadBookings();
    this.loadNotifications();
  }

  getBookingDate(booking: Booking): string {
    return booking.session?.start_time ?? booking.start_time ?? booking.created_at ?? '';
  }

  isCancelled(booking: Booking): boolean {
    return booking.status?.toLowerCase() === 'cancelled';
  }

  isRead(note: Notification): boolean {
    return note.is_read ?? note.read ?? false;
  }

  cancelBooking(booking: Booking): void {
    this.cancellingId = booking.id;
    this.api.cancelBooking(booking.id).subscribe({
      next: () => {
        this.bookings = this.bookings.map(item => item.id === booking.id ? { ...item, status: 'cancelled' } : item);
        this.cancellingId = null;
      },
      error: error => { this.bookingsError = apiErrorMessage(error); this.cancellingId = null; }
    });
  }

  markRead(note: Notification): void {
    this.markingId = note.id;
    this.api.markNotificationRead(note.id).subscribe({
      next: () => {
        this.notifications = this.notifications.map(item => item.id === note.id ? { ...item, is_read: true, read: true } : item);
        this.markingId = null;
      },
      error: error => { this.notificationsError = apiErrorMessage(error); this.markingId = null; }
    });
  }

  private loadBookings(): void {
    this.api.myBookings().subscribe({
      next: items => { this.bookings = items; this.bookingsLoading = false; },
      error: error => { this.bookingsError = apiErrorMessage(error); this.bookingsLoading = false; }
    });
  }

  private loadNotifications(): void {
    this.api.notifications().subscribe({
      next: items => { this.notifications = items; this.notificationsLoading = false; },
      error: error => { this.notificationsError = apiErrorMessage(error); this.notificationsLoading = false; }
    });
  }
}
