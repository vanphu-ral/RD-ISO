import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { SortByDirective, SortDirective } from 'app/shared/sort';
import { MessageService, SharedModule } from 'primeng/api';
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
import * as XLSX from 'xlsx';
import dayjs from 'dayjs/esm';

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
    NoZeroDecimalPipe,
    DatePipe,
  ],
  templateUrl: './summary-detail.component.html',
  styleUrls: ['./summary-detail.component.scss'],
  providers: [MessageService],
})
export class SummaryDetailComponent implements OnInit {
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
    private messageService: MessageService,
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
    this.summaryService.getSummaryDetail(this.reportDto, page, size).subscribe({
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
      const totalPointSummarize = data.sumOfScoreScale - (data.sumOfLy * markLC.mark + data.sumOfNc * markNC.mark);
      return totalPointSummarize;
    } else {
      return data.sumOfScoreScale;
    }
  }

  // export excel
  exportExcel(): void {
    if (!this.data || this.data.length === 0) {
      this.messageService?.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Không có dữ liệu để xuất Excel!',
      });
      return;
    }

    // --- Format ngày helper ---
    const formatDate = (date: string | Date): string => (date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '');

    // --- Chuẩn bị dữ liệu xuất ---
    const exportData = this.data.map((row, index) => ({
      STT: index + 1,
      'Thời gian kế hoạch KT': formatDate(row.timeStart),
      Ngành: row.subjectOfAssetmentPlan,
      'Tên tổ': row.groupName,
      'Tổng BBKT phát hành': row.sumOfReport,
      'Loại BB Kiểm tra': row.reportType,
      'Tổng số đợt kiểm tra': row.sumOfAudit,
      'Tổng số lần lập biên bản': row.sumOfCreateReport,
      'Tổng điểm': this.getTotalPoint(row),
      'Điểm trung bình': this.getTotalPointAvg(row),
      'Kiểu tính điểm': row.convertScore,
      'Tổng NC': row.sumOfNc,
      'Tổng LY': row.sumOfLy,
      'Tổng đạt': row.sumOfPass,
      'Tổng không đạt': row.sumOfFail,
      'Tổng số lỗi đã khắc phục': row.sumOfCheck,
      'Tổng lỗi chưa khắc phục': row.sumOfUncheck,
    }));

    // --- Tạo worksheet ---
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // --- Thiết lập độ rộng cột tự động ---
    const headerKeys = Object.keys(exportData[0]);
    ws['!cols'] = headerKeys.map(key => ({
      wch: Math.max(15, key.length + 5), // auto width
    }));

    // --- In đậm & căn giữa dòng tiêu đề ---
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
    headerKeys.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      if (ws[cellAddress]) {
        ws[cellAddress].s = headerStyle;
      }
    });

    // --- Tạo workbook ---
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo BBKT');

    // --- Xuất file ---
    const fileName = `BaoCao_BBKT_${dayjs().format('YYYYMMDD_HHmm')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
}
