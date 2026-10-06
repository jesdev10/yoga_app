import { Component, Input } from '@angular/core';

@Component({
  selector: 'bliss-api-error',
  standalone: true,
  template: `<div class="api-error" role="alert"><strong>{{ title }}</strong><span>{{ message }}</span><small>The Bliss Mind API should be running at http://localhost:8000. Check that the server is available and try again.</small></div>`
})
export class ApiErrorComponent {
  @Input() message = 'We could not reach the service.';
  @Input() title = 'Something needs attention';
}

@Component({
  selector: 'bliss-loading',
  standalone: true,
  template: `<div class="loading-state" role="status"><span class="spinner"></span><span>{{ message }}</span></div>`
})
export class LoadingComponent {
  @Input() message = 'A moment while we get things ready…';
}

@Component({
  selector: 'bliss-empty',
  standalone: true,
  template: `<div class="empty-state"><span class="empty-orbit">✳</span><h3>{{ title }}</h3><p>{{ message }}</p><ng-content /></div>`
})
export class EmptyComponent {
  @Input() title = 'A little quiet here';
  @Input() message = 'There is nothing to show just yet.';
}

export function apiErrorMessage(error: unknown): string {
  const candidate = error as { error?: { detail?: unknown; message?: unknown }; message?: unknown };
  const detail = candidate?.error?.detail ?? candidate?.error?.message ?? candidate?.message;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((item: { msg?: string }) => item.msg ?? '').filter(Boolean).join(' ');
  return 'The request could not be completed. Please try again.';
}
