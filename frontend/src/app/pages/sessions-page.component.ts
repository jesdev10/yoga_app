import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { Session } from '../core/models';
import { ApiErrorComponent, EmptyComponent, LoadingComponent, apiErrorMessage } from '../shared/ui';

@Component({
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, RouterLink, ApiErrorComponent, EmptyComponent, LoadingComponent],
  template: `
    <section class="page-hero page-hero-sessions"><div class="page-hero-inner"><span class="eyebrow">FIND YOUR FEEL-GOOD</span><h1>Move, breathe,<br><em>be here.</em></h1><p>Discover a practice that meets you where you are today.</p></div><div class="page-hero-orbit">✳</div></section>
    <section class="section-wrap browse-section">
      <div class="browse-toolbar">
        <div class="search-field"><span>⌕</span><input type="search" placeholder="Search sessions, instructors, places…" [(ngModel)]="query" aria-label="Search sessions"></div>
        <label class="select-field"><span class="sr-only">Filter by category</span><select [(ngModel)]="category"><option value="">All practices</option><option *ngFor="let item of categories" [value]="item">{{ item }}</option></select><span>⌄</span></label>
        <label class="select-field"><span class="sr-only">Sort sessions</span><select [(ngModel)]="sortBy"><option value="soonest">Soonest</option><option value="price">Price: low to high</option><option value="title">Name</option></select><span>⌄</span></label>
      </div>
      <p class="results-count" *ngIf="!loading && !error">{{ filteredSessions.length }} {{ filteredSessions.length === 1 ? 'session' : 'sessions' }} to explore</p>
      <bliss-loading *ngIf="loading" message="Finding your next feel-good…" />
      <bliss-api-error *ngIf="error" [message]="error" />
      <bliss-empty *ngIf="!loading && !error && !filteredSessions.length" title="No sessions found" message="Try another search or clear a filter to see what’s available." />
      <div class="session-grid session-grid-browse" *ngIf="!loading && !error && filteredSessions.length">
        <a class="session-card" *ngFor="let session of filteredSessions" [routerLink]="['/sessions', session.id]">
          <div class="session-photo" [style.backgroundImage]="session.image_url ? 'url(' + session.image_url + ')' : null"><span class="photo-label">{{ session.category }}</span><span class="photo-arrow">↗</span></div>
          <div class="session-card-content"><div class="session-meta">{{ session.duration_minutes }} MIN <span>·</span> {{ session.location }}</div><h3>{{ session.title }}</h3><p class="session-summary">{{ session.description }}</p><div class="session-card-bottom"><span>with {{ session.instructor }}</span><strong>GH₵{{ session.price }}</strong></div><span class="spots-label">{{ session.spots_left }} {{ session.spots_left === 1 ? 'spot' : 'spots' }} left</span></div>
        </a>
      </div>
    </section>
  `
})
export class SessionsPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  sessions: Session[] = [];
  categories: string[] = [];
  query = '';
  category = '';
  sortBy = 'soonest';
  loading = true;
  error = '';

  get filteredSessions(): Session[] {
    const term = this.query.trim().toLowerCase();
    return this.sessions
      .filter(item => !this.category || item.category.toLowerCase() === this.category.toLowerCase())
      .filter(item => !term || [item.title, item.category, item.instructor, item.location, item.description].some(value => value.toLowerCase().includes(term)))
      .sort((a, b) => this.sortBy === 'price' ? a.price - b.price : this.sortBy === 'title' ? a.title.localeCompare(b.title) : new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }

  ngOnInit(): void {
    this.category = this.route.snapshot.queryParamMap.get('category') ?? '';
    this.api.sessions().subscribe({
      next: items => {
        this.sessions = items;
        this.categories = [...new Set(items.map(item => item.category))];
        this.category = this.categories.find(item => item.toLowerCase() === this.category.toLowerCase()) ?? this.category;
        this.loading = false;
      },
      error: error => { this.error = apiErrorMessage(error); this.loading = false; }
    });
  }
}
