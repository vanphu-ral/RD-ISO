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

@Component({
  selector: 'jhi-summary-detail',
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
  templateUrl: './summary-detail.component.html',
  styleUrls: ['./summary-detail.component.scss'],
})
export class SummaryDetailComponent implements OnInit {
  protected route = inject(ActivatedRoute);

  listBranch: any[] = [];
  selectedBranches: any[] = [];
  date: Date = new Date();
  summary: any[] = [];

  ngOnInit(): void {}
}
