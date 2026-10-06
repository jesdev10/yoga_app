import { Routes } from '@angular/router';
import { ArticlesPageComponent } from './pages/articles-page.component';
import { AuthPageComponent } from './pages/auth-page.component';
import { DashboardPageComponent } from './pages/dashboard-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { InstructorPageComponent } from './pages/instructor-page.component';
import { SessionDetailPageComponent } from './pages/session-detail-page.component';
import { SessionsPageComponent } from './pages/sessions-page.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Bliss Mind — Find your balance' },
  { path: 'sessions', component: SessionsPageComponent, title: 'Explore sessions — Bliss Mind' },
  { path: 'sessions/:id', component: SessionDetailPageComponent, title: 'Session details — Bliss Mind' },
  { path: 'login', component: AuthPageComponent, data: { mode: 'login' }, title: 'Welcome back — Bliss Mind' },
  { path: 'register', component: AuthPageComponent, data: { mode: 'register' }, title: 'Create your account — Bliss Mind' },
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [authGuard], title: 'Your space — Bliss Mind' },
  { path: 'articles', component: ArticlesPageComponent, title: 'Daily wellness — Bliss Mind' },
  { path: 'articles/:slug', component: ArticlesPageComponent, title: 'Wellness story — Bliss Mind' },
  { path: 'instructors/apply', component: InstructorPageComponent, title: 'Teach with us — Bliss Mind' },
  { path: '**', redirectTo: '' }
];
