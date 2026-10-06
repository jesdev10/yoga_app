import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { Article } from '../core/models';
import { ApiErrorComponent, EmptyComponent, LoadingComponent, apiErrorMessage } from '../shared/ui';

@Component({
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, RouterLink, ApiErrorComponent, EmptyComponent, LoadingComponent],
  template: `
    <section class="page-hero journal-hero" *ngIf="!slug"><div class="page-hero-inner"><span class="eyebrow">THE BLISS MIND JOURNAL</span><h1>For the life<br><em>you're living.</em></h1><p>Thoughts, practices, and gentle reminders for wherever you are.</p></div><div class="page-hero-orbit">✳</div></section>
    <section class="section-wrap article-list-section" *ngIf="!slug">
      <bliss-loading *ngIf="loading" message="Opening the journal…" />
      <bliss-api-error *ngIf="error" [message]="error" />
      <bliss-empty *ngIf="!loading && !error && !articles.length" title="The journal is taking a breath" message="There are no stories here just yet. Please come back soon." />
      <div class="article-grid" *ngIf="!loading && articles.length">
        <a class="article-card" *ngFor="let article of articles" [routerLink]="['/articles', article.slug]">
          <div class="article-photo" [style.backgroundImage]="article.image_url ? 'url(' + article.image_url + ')' : null"><span class="photo-arrow">↗</span></div>
          <div class="article-card-copy"><span class="eyebrow">{{ article.category }} <span>·</span> {{ article.published_at | date:'mediumDate' }}</span><h2>{{ article.title }}</h2><p>{{ article.summary }}</p><span class="text-link">Read the story <b>→</b></span></div>
        </a>
      </div>
    </section>
    <section class="section-wrap article-detail-wrap" *ngIf="slug">
      <a class="back-link" routerLink="/articles">← All journal stories</a>
      <bliss-loading *ngIf="loading" message="Opening the story…" />
      <bliss-api-error *ngIf="error" [message]="error" />
      <article class="article-detail" *ngIf="article && !loading">
        <div class="article-detail-image" [style.backgroundImage]="article.image_url ? 'url(' + article.image_url + ')' : null"></div>
        <div class="article-detail-copy"><span class="eyebrow">{{ article.category }} <span>·</span> {{ article.published_at | date:'longDate' }}</span><h1>{{ article.title }}</h1><p class="article-summary">{{ article.summary }}</p><div class="article-byline">Words by <strong>{{ article.author }}</strong></div><div class="article-body">{{ article.body }}</div><a class="text-link" routerLink="/articles">← Back to the journal</a></div>
      </article>
    </section>
  `
})
export class ArticlesPageComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  slug = '';
  articles: Article[] = [];
  article: Article | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') ?? '';
    if (this.slug) {
      this.api.article(this.slug).subscribe({
        next: article => { this.article = article; this.loading = false; },
        error: error => { this.error = apiErrorMessage(error); this.loading = false; }
      });
    } else {
      this.api.articles().subscribe({
        next: articles => { this.articles = articles; this.loading = false; },
        error: error => { this.error = apiErrorMessage(error); this.loading = false; }
      });
    }
  }
}
