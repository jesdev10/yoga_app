import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { Article, Session } from '../core/models';
import { ApiErrorComponent, EmptyComponent, LoadingComponent, apiErrorMessage } from '../shared/ui';

@Component({
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, RouterLink, ApiErrorComponent, EmptyComponent, LoadingComponent],
  template: `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><span class="eyebrow-dot"></span> YOUR WELLBEING, YOUR WAY</span>
        <h1>Make space<br>for <em>yourself.</em></h1>
        <p>Find thoughtful movement, stillness and care — led by people who help you feel more like you.</p>
        <div class="hero-actions"><a class="button" routerLink="/sessions">Explore sessions <span>↗</span></a><a class="text-link" routerLink="/articles">A moment for your mind <span>→</span></a></div>
        <div class="hero-note"><span class="note-avatars">● ● ●</span><span>A community moving at its own pace</span></div>
      </div>
      <div class="hero-visual">
        <div class="hero-image image-cover"></div>
        <div class="hero-stamp"><span>find your</span><strong>balance</strong><span>one breath at a time</span></div>
        <span class="hero-caption">A softer kind of strength.</span>
      </div>
      <div class="hero-bottom-mark">01 <span>—</span> 04</div>
    </section>
    <section class="section-wrap category-section">
      <div class="section-heading"><div><span class="eyebrow">A PRACTICE FOR EVERY YOU</span><h2>Come as you are.</h2></div><a class="text-link" routerLink="/sessions">See all sessions <span>→</span></a></div>
      <div class="category-grid">
        <a *ngFor="let category of categories; let i = index" class="category-tile" [class]="'category-tile cat-' + i" [routerLink]="['/sessions']" [queryParams]="{category: category}">
          <span class="category-number">0{{ i + 1 }}</span><span class="category-icon">{{ icons[i] }}</span><strong>{{ category }}</strong><span class="category-explore">Explore <b>↗</b></span>
        </a>
      </div>
    </section>
    <section class="featured-section">
      <div class="section-wrap">
        <div class="section-heading"><div><span class="eyebrow">A GOOD PLACE TO BEGIN</span><h2>Find your flow.</h2></div><a class="text-link" routerLink="/sessions">Browse everything <span>→</span></a></div>
        <bliss-loading *ngIf="sessionsLoading" message="Finding sessions for you…" />
        <bliss-api-error *ngIf="sessionsError" [message]="sessionsError" />
        <bliss-empty *ngIf="!sessionsLoading && !sessionsError && !sessions.length" title="Your next favorite session is on its way" message="There are no sessions available right now. Please check back soon." />
        <div class="session-grid" *ngIf="!sessionsLoading && sessions.length">
          <a class="session-card" *ngFor="let session of sessions" [routerLink]="['/sessions', session.id]">
            <div class="session-photo" [style.backgroundImage]="session.image_url ? 'url(' + session.image_url + ')' : null"><span class="photo-label">{{ session.category }}</span><span class="photo-arrow">↗</span></div>
            <div class="session-card-content"><div class="session-meta">{{ session.duration_minutes }} MIN <span>·</span> {{ session.location }}</div><h3>{{ session.title }}</h3><div class="session-card-bottom"><span>with {{ session.instructor }}</span><strong>GH₵{{ session.price }}</strong></div></div>
          </a>
        </div>
      </div>
    </section>
    <section class="quote-section">
      <div class="quote-art"><span>“</span><div class="quote-leaf leaf-one"></div><div class="quote-leaf leaf-two"></div></div>
      <div class="quote-copy"><span class="eyebrow">A GENTLER KIND OF PROGRESS</span><blockquote>“You don't have to earn rest. You just have to let yourself have it.”</blockquote><span class="quote-credit">A reminder from the Bliss Mind community</span><a class="text-link" routerLink="/articles">Read the journal <span>→</span></a></div>
    </section>
    <section class="section-wrap journal-preview">
      <div class="section-heading"><div><span class="eyebrow">WORDS TO CARRY WITH YOU</span><h2>A little daily nourishment.</h2></div><a class="text-link" routerLink="/articles">Visit the journal <span>→</span></a></div>
      <bliss-loading *ngIf="articlesLoading" message="Opening the journal…" />
      <bliss-api-error *ngIf="articlesError" [message]="articlesError" />
      <bliss-empty *ngIf="!articlesLoading && !articlesError && !articles.length" title="Stories are taking a breath" message="There are no articles to read just yet." />
      <div class="article-preview-grid" *ngIf="!articlesLoading && articles.length">
        <a class="article-preview" *ngFor="let article of articles.slice(0, 3)" [routerLink]="['/articles', article.slug]">
          <div class="article-photo" [style.backgroundImage]="article.image_url ? 'url(' + article.image_url + ')' : null"></div>
          <span class="eyebrow">{{ article.category }} <span>·</span> {{ article.published_at | date:'mediumDate' }}</span>
          <h3>{{ article.title }}</h3><p>{{ article.summary }}</p><span class="text-link">Read story <b>→</b></span>
        </a>
      </div>
    </section>
    <section class="join-banner"><div><span class="eyebrow">YOUR SPACE IS WAITING</span><h2>Small steps count.<br><em>Start with one.</em></h2></div><a class="button button-light" routerLink="/sessions">Find your session <span>↗</span></a></section>
  `
})
export class HomePageComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly categories = ['Yoga', 'Pilates', 'Meditation', 'Ice bath'];
  readonly icons = ['↟', '◉', '☼', '≈'];
  sessions: Session[] = [];
  articles: Article[] = [];
  sessionsLoading = true;
  articlesLoading = true;
  sessionsError = '';
  articlesError = '';

  ngOnInit(): void {
    this.api.sessions().subscribe({
      next: items => { this.sessions = items.slice(0, 3); this.sessionsLoading = false; },
      error: error => { this.sessionsError = apiErrorMessage(error); this.sessionsLoading = false; }
    });
    this.api.articles().subscribe({
      next: items => { this.articles = items.slice(0, 3); this.articlesLoading = false; },
      error: error => { this.articlesError = apiErrorMessage(error); this.articlesLoading = false; }
    });
  }
}
