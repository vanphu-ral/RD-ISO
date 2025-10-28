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
import { ConvertService } from 'app/entities/convert/service/convert.service';
import { NoZeroDecimalPipe } from 'app/shared/pipe/no-zero-decimal.pipe';
import { CheckerGroupService } from 'app/entities/checker-group/service/checker-group.service';
import { ReportTypeService } from 'app/entities/report-type/service/report-type.service';
import { DatePipe } from '@angular/common';
import { EvaluatorService } from 'app/entities/evaluator/service/evaluator.service';
import { CheckTargetService } from 'app/entities/check-target/service/check-target.service';

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
    NoZeroDecimalPipe,
    DatePipe,
  ],
  templateUrl: './summary-report-detail.component.html',
  styleUrls: ['./summary-report-detail.component.scss'],
})
export class SummaryReportDetailComponent implements OnInit {
  data: any[] = [];
  listBranch: any[] = [];
  listTeams: any[] = [];
  listReportType: any[] = [];
  reportDto: ReportDTO = {};
  statisticalData: any[] = [];
  listEvalReportBase: any = [];
  listEvaluator: any[] = [];
  listTestOfObject: any[] = [];

  // Pagination and loading state
  totalRecords: number = 0;
  pageSize: number = 10;
  loading = false;

  constructor(
    private summaryService: SummaryService,
    private convertService: ConvertService,
    private checkerGroupService: CheckerGroupService,
    private reportTypeService: ReportTypeService,
    private evaluatorService: EvaluatorService,
    private checkTargetService: CheckTargetService,
  ) {}

  ngOnInit(): void {
    this.reportDto.timeStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.reportDto.timeEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    this.convertService.query().subscribe(res => {
      this.listEvalReportBase = res.body || [];
    });
    this.checkerGroupService.getGroupInfo().subscribe(res => {
      this.listBranch = [...new Map(res.map((item: any) => [item.branchCode, { code: item.branchCode, name: item.branchName }])).values()];
      this.listTeams = res.map((item: any) => ({ code: item.groupCode, name: item.groupName }));
      this.reportDto.subjectOfAssetmentPlan = this.listBranch.map(item => item.name);
      this.reportDto.groupName = this.listTeams.map(item => item.name);
    });
    this.reportTypeService.getAllCheckTargets().subscribe(res => {
      this.listReportType = res;
      this.reportDto.reportType = this.listReportType.map(item => item.name);
    });
    this.evaluatorService.getAllCheckTargets().subscribe(res => {
      this.listEvaluator = res;
    });
    this.checkTargetService.query().subscribe(res => {
      this.listTestOfObject = res.body || [];
      this.reportDto.testOfObject = this.listTestOfObject.map(item => item.name);
    });
    this.loadData(1, this.pageSize);
  }

  loadData(page: number = 1, size: number = 10) {
    this.loading = true;
    this.summaryService.getSummaryReportDetail(this.reportDto, page, size).subscribe({
      next: res => {
        this.data = this.formatData(res.content || []);
        this.totalRecords = res.totalElements;
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching data', err);
        this.loading = false;
      },
    });
  }

  formatData(data: any[]) {
    return data.map(item => ({
      ...item,
      checker: this.listEvaluator.find(evalua => evalua.username === item.checker)?.name,
    }));
  }

  onPage(event: any) {
    const page = event.first / event.rows;
    const size = event.rows;
    this.pageSize = size;
    this.loadData(page, size);
  }

  getTotalPointAvg(data: any) {
    if (data.convertScore == 'Tính điểm') {
      const markNC = this.listEvalReportBase.find((item: any) => item.name == 'NC');
      const markLC = this.listEvalReportBase.find((item: any) => item.name == 'LY');
      const totalPointSummarize =
        (data.scoreScale * data.sumOfAudit - (data.sumOfLy * markLC.mark + data.sumOfNc * markNC.mark)) / data.sumOfAudit;
      return isNaN(totalPointSummarize) ? data.scoreScale : totalPointSummarize;
    } else {
      return data.scoreScale;
    }
  }

  getTotalPoint(data: any) {
    if (data.convertScore == 'Tính điểm') {
      const markNC = this.listEvalReportBase.find((item: any) => item.name == 'NC');
      const markLC = this.listEvalReportBase.find((item: any) => item.name == 'LY');
      const totalPointSummarize = data.scoreScale - (data.sumOfLy * markLC.mark + data.sumOfNc * markNC.mark);
      return totalPointSummarize;
    } else {
      return data.scoreScale;
    }
  }
}
