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
import { ReportDTO } from '../summary.model';
import { ConvertService } from 'app/entities/convert/service/convert.service';
import { NoZeroDecimalPipe } from 'app/shared/pipe/no-zero-decimal.pipe';
import { CheckerGroupService } from 'app/entities/checker-group/service/checker-group.service';
import { ReportTypeService } from 'app/entities/report-type/service/report-type.service';
import { DatePipe } from '@angular/common';
import { EvaluatorService } from 'app/entities/evaluator/service/evaluator.service';
import { CheckTargetService } from 'app/entities/check-target/service/check-target.service';
import { ReportService } from 'app/entities/report/service/report.service';
import { PlanGroupService } from 'app/entities/plan-group/service/plan-group.service';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs/esm';

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
  providers: [MessageService],
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

  // dialog view detail
  dialogGeneralCheckPlan = false;
  dialogSummaryOfCriteriaConclusion = false;
  reportSelected: any = {};
  checkPlanDetails: any[] = [];
  summaryOfCriteriaConclusion: any[] = [];
  criteriaSummaries: any[] = [];
  dialogViewImage = false;
  listImgReports: any[] = [];

  constructor(
    private summaryService: SummaryService,
    private convertService: ConvertService,
    private checkerGroupService: CheckerGroupService,
    private reportTypeService: ReportTypeService,
    private evaluatorService: EvaluatorService,
    private checkTargetService: CheckTargetService,
    private reportService: ReportService,
    private planGrService: PlanGroupService,
    private messageService: MessageService,
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
    this.loadData(0, this.pageSize);
  }

  loadData(page: number = 0, size: number = 10) {
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
      'Tên kế hoạch KT': row.planName,
      'Tên BBKT': row.reportName,
      'Người kiểm tra': row.checker,
      Ngành: row.subjectOfAssetmentPlan,
      'Tên tổ': row.groupName,
      'Người được kiểm tra': row.testOfObject,
      'Loại BB Kiểm tra': row.reportType,
      'Tổng số đợt kiểm tra': row.sumOfAudit,
      'Tổng điểm': this.getTotalPoint(row),
      'Điểm trung bình': this.getTotalPointAvg(row),
      'Tổng NC': row.sumOfNc,
      'Tổng LY': row.sumOfLy,
      'Tổng đạt': row.sumOfPass,
      'Tổng không đạt': row.sumOfFail,
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

  // view detail function
  showDialogGeneralCheckPlan(data: any): void {
    this.reportSelected = data;
    this.reportService.getAllStatisticalByReportId(data.planId, data.reportId).subscribe(res => {
      this.checkPlanDetails = res.body;
    });
    this.dialogGeneralCheckPlan = true;
  }

  totalPointSummarize(data: any) {
    if (this.reportSelected.convertScore == 'Tính điểm') {
      const markNC = this.listEvalReportBase.find((item: any) => item.name == 'NC');
      const markLC = this.listEvalReportBase.find((item: any) => item.name == 'LY');
      const totalPointSummarize = this.reportSelected.scoreScale - (data.sumOfLy * markLC.mark + data.sumOfNc * markNC.mark);
      return totalPointSummarize;
    } else {
      return this.reportSelected.scoreScale;
    }
  }

  showDialogSummaryOfCriteriaConclusion(data: any): void {
    this.planGrService.findAllDetailByHistoryAndReportId(data.planGroupHistoryId, this.reportSelected.reportId).subscribe(res => {
      this.criteriaSummaries = res.body || [];
      this.criteriaSummaries.sort((a: any, b: any) => {
        if (a.criterialGroupName < b.criterialGroupName) return -1;
        if (a.criterialGroupName > b.criterialGroupName) return 1;
        return 0;
      });
    });
    this.dialogSummaryOfCriteriaConclusion = true;
  }

  showDialogViewImg(data: any) {
    this.listImgReports = JSON.parse(data);
    this.dialogViewImage = true;
  }
}
