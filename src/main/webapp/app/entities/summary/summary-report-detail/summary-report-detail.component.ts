import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { SortByDirective, SortDirective } from 'app/shared/sort';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SummaryService } from '../service/summary.service';
import { ReportDTO } from '../summary.model';

@Component({
  selector: 'jhi-summary-report-detail',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    FormatMediumDatetimePipe,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    NgbModule,
    DialogModule,
    TagModule,
    MultiSelectModule,
    CalendarModule,
  ],
  templateUrl: './summary-report-detail.component.html',
  styleUrls: ['./summary-report-detail.component.scss'],
})
export class SummaryReportDetailComponent implements OnInit {
  summaryReport: any = null;
  listBranch: any[] = [];
  selectedBranches: any[] = [];
  date: Date = new Date();
  data: any[] = [];
  reportDto: ReportDTO = {};
  statisticalData: any[] = [];
  totalRecords = 0;
  loading = false;

  constructor(
    private summaryService: SummaryService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(page: number = 0, size: number = 10) {
    this.loading = true;

    this.summaryService.getSummaryReportDetail(this.reportDto, page, size).subscribe({
      next: res => {
        console.log(res);

        this.data = res.content;
        this.totalRecords = res.totalElements;
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching data', err);
        this.loading = false;
      },
    });
  }
}
