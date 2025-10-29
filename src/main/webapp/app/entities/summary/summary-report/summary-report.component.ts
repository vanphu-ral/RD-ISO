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
import { ConvertService } from 'app/entities/convert/service/convert.service';
import { CheckerGroupService } from 'app/entities/checker-group/service/checker-group.service';
import { ReportTypeService } from 'app/entities/report-type/service/report-type.service';
import { EvaluatorService } from 'app/entities/evaluator/service/evaluator.service';
import { CheckTargetService } from 'app/entities/check-target/service/check-target.service';
import { ReportService } from 'app/entities/report/service/report.service';
import { PlanGroupService } from 'app/entities/plan-group/service/plan-group.service';
import { ReportDTO } from '../summary.model';
import { NoZeroDecimalPipe } from 'app/shared/pipe/no-zero-decimal.pipe';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'jhi-summary-report',
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
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss'],
})
export class SummaryReportComponent implements OnInit {
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
    const convert$ = this.convertService.query();
    const checkerGroup$ = this.checkerGroupService.getAllCheckerGroups();
    const reportType$ = this.reportTypeService.getAllCheckTargets();
    const evaluator$ = this.evaluatorService.getAllCheckTargets();
    const checkTarget$ = this.checkTargetService.query();
    forkJoin({
      convert: convert$,
      checkerGroup: checkerGroup$,
      reportType: reportType$,
      evaluator: evaluator$,
      checkTarget: checkTarget$,
    }).subscribe(({ convert, checkerGroup, reportType, evaluator, checkTarget }) => {
      this.listEvalReportBase = convert.body || [];
      this.listBranch = [...new Map(checkerGroup.map((item: any) => [item.code, { code: item.code, name: item.name }])).values()];
      this.listTeams = checkerGroup.map((item: any) => ({ code: item.groupCode, name: item.groupName }));
      this.reportDto.subjectOfAssetmentPlan = this.listBranch.map(item => item.name);
      this.reportDto.groupName = this.listTeams.map(item => item.name);
      this.listReportType = reportType;
      this.reportDto.reportType = this.listReportType.map(item => item.name);
      this.listEvaluator = evaluator;
      this.listTestOfObject = checkTarget.body || [];
      this.reportDto.testOfObject = this.listTestOfObject.map(item => item.name);
      this.loadData(0, this.pageSize);
    });
  }

  loadData(page: number = 0, size: number = 10) {
    this.loading = true;
    this.summaryService.getSummaryReport(this.reportDto, page, size).subscribe({
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
