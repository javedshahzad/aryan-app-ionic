import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
  },
  {
    path: 'notification-list',
    loadComponent: () => import('./pages/notification-list/notification-list.page').then(m => m.NotificationListPage)
  },
  {
    path: 'project-list',
    loadComponent: () => import('./pages/project-list/project-list.page').then(m => m.ProjectListPage)
  },
  {
    path: 'project-detail/:id',
    loadComponent: () => import('./pages/project-detail/project-detail.page').then(m => m.ProjectDetailPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
  },
  {
    path: 'notice',
    loadComponent: () => import('./pages/notice/notice.page').then(m => m.NoticePage)
  },
  {
    path: 'leave',
    loadComponent: () => import('./pages/leave/leave.page').then(m => m.LeavePage)
  },
  {
    path: 'schedule-event',
    loadComponent: () => import('./pages/schedule-event/schedule-event.page').then(m => m.ScheduleEventPage)
  },
  {
    path: 'customer-landing',
    loadComponent: () => import('./pages/customer-landing/customer-landing.page').then(m => m.CustomerLandingPage)
  },
  {
    path: 'add-customer',
    loadComponent: () => import('./pages/add-customer/add-customer.page').then(m => m.AddCustomerPage)
  },
  {
    path: 'content/:type',
    loadComponent: () => import('./pages/content/content.page').then(m => m.ContentPage)
  },
  {
    path: 'customer-list',
    loadComponent: () => import('./pages/customer-list/customer-list.page').then( m => m.CustomerListPage)
  },
  {
    path: 'customer-summary-details/:status',
    loadComponent: () => import('./pages/customer-summary-details/customer-summary-details.page').then( m => m.CustomerSummaryDetailsPage)
  },  {
    path: 'edit-customer-details',
    loadComponent: () => import('./pages/edit-customer-details/edit-customer-details.page').then( m => m.EditCustomerDetailsPage)
  },
  {
    path: 'events-with-calendar',
    loadComponent: () => import('./pages/events-with-calendar/events-with-calendar.page').then( m => m.EventsWithCalendarPage)
  }


];
