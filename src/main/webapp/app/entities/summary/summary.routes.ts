import { Routes } from '@angular/router';
import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SummaryDetailComponent } from './summary-detail/summary-detail.component';
import summarizePlanRoute from '../summarize-plan/summarize-plan.routes';
import { SummaryReportComponent } from './summary-report/summary-report.component';
import { SummaryReportDetailComponent } from './summary-report-detail/summary-report-detail.component';

const summaryDetailRoute: Routes = [
  {
    path: 'summary-detail',
    component: SummaryDetailComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'summary-report',
    component: SummaryReportComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'summary-report-detail',
    component: SummaryReportDetailComponent,
    canActivate: [UserRouteAccessService],
  },
];

export default summaryDetailRoute;
