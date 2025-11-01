import { Component, NgZone, inject, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, forkJoin, Observable, Subscription, tap } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, PrimeNGConfig, TreeNode } from 'primeng/api'; // Import TreeNode
import Swal from 'sweetalert2';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { IPlan } from '../plan.model';
import { EntityArrayResponseType, PlanService } from '../service/plan.service';
import { PlanDeleteDialogComponent } from '../delete/plan-delete-dialog.component';
import { TreeTableModule } from 'primeng/treetable';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { SummarizePlanComponent } from 'app/entities/summarize-plan/summarize-plan.component';
import { TagModule } from 'primeng/tag';
import { ReportService } from 'app/entities/report/service/report.service';
import { EvaluatorService } from 'app/entities/evaluator/service/evaluator.service';
import { ConvertService } from 'app/entities/convert/service/convert.service';
import { FileUploadModule } from 'primeng/fileupload';
import dayjs from 'dayjs/esm';
import { PlanGroupService } from 'app/entities/plan-group/service/plan-group.service';
import * as XLSX from 'xlsx';
import { ExportExcelService } from '../service/export-excel.service';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { AccountService } from 'app/core/auth/account.service';
import { DropdownModule } from 'primeng/dropdown';
import { FrequencyService } from 'app/entities/frequency/service/frequency.service';
import { LayoutService } from 'app/layouts/service/layout.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarModule } from 'primeng/sidebar';
import { NoZeroDecimalPipe } from 'app/shared/pipe/no-zero-decimal.pipe';
import { MultiSelectModule } from 'primeng/multiselect';
import { RemediationPlanService } from '../service/remediationPlan.service';

@Component({
  standalone: true,
  selector: 'jhi-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    FormatMediumDatetimePipe,
    TreeTableModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    NgbModule,
    DialogModule,
    TagModule,
    FileUploadModule,
    HasAnyAuthorityDirective,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    ConfirmDialogModule,
    SidebarModule,
    NoZeroDecimalPipe,
    MultiSelectModule,
  ],
  providers: [SummarizePlanComponent, ConfirmationService],
})
export class PlanComponent implements OnInit {
  subscription: Subscription | null = null;
  plans?: IPlan[];
  isLoading = false;
  treeNodes!: TreeNode[];
  sortState = sortStateSignal({});
  files?: TreeNode[];
  expandedRows: { [key: string]: boolean } = {};
  @ViewChild('dt2') dt2!: any;
  planDetailResults: any[] = [];
  planParent: any = {};
  listOfFrequency: any[] = [];
  columnWidths = {
    'min-width': '960px',
    width: '100%',
  };
  planEvaluations: any[] = [];
  checkPlanDetails: any[] = [];
  criteriaSummaries: any = [];
  listImgReports: any[] = [];

  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  selectedPageSize: number = 10;
  first: number = 0;
  totalRecords: number = 0;
  dialogCheckPlan = false;
  dialogCheckPlanChild = false;
  dialogGeneralCheckPlan = false;
  dialogSummaryOfCriteriaConclusion = false;
  dialogViewImage = false;
  evaluators: any[] = [];
  planGrDetail: any[] = [];
  listEvalReports: any = [];
  listEvalReportBase: any = [];
  planGroup: any = {};
  selectedData: any = null;
  dialogVisibility: { [key: string]: boolean } = {};
  selectedFiles: { dataKey: string; files: File[] }[] = [];
  imageLoadErrors = new Set<string>();
  report: any = {};
  reportSelected: any = {};
  currentPage: number = 0;
  minSelectableDate!: Date;
  maxSelectableDate!: Date;
  account: any = {};
  statuses = ['Mới tạo', 'Đang thực hiện', 'Đã hoàn thành', 'Chưa hoàn thành'];
  listConvertScore = ['Tính điểm', 'Bước nhảy'];
  isNameDuplicate: { [key: string]: boolean } = {};
  // Mobile availible
  isMobile: boolean = false;
  dialogListReportByPlan: boolean = false;
  selectedPlan: any = {};
  listReportByPlan: any = [];
  noteDialogVisible = false;
  selectedReport: any = null;
  sidebarVisible: boolean = false;
  checkAll: boolean = false;
  selectedFrequencies: string[] = [];
  IsHasRemediationPlan: boolean = false;

  // filter page
  filter: any = {};
  page: number = 0;
  size: number = 10;

  trackId = (_index: number, item: IPlan): number => this.planService.getPlanIdentifier(item);

  constructor(
    public router: Router,
    protected planService: PlanService,
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal,
    protected convertService: ConvertService,
    protected sortService: SortService,
    protected ngZone: NgZone,
    protected summarizePlanDiaglog: SummarizePlanComponent,
    protected evaluatorService: EvaluatorService,
    protected planGrService: PlanGroupService,
    private exportExcelService: ExportExcelService,
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private frequencyService: FrequencyService,
    private primengConfig: PrimeNGConfig,
    private layoutService: LayoutService,
    protected reportService: ReportService,
    private remediationPlanService: RemediationPlanService,
  ) {}

  ngOnInit(): void {
    this.layoutService.isMobile$.subscribe(value => {
      this.isMobile = value;
    });
    this.primengConfig.setTranslation({
      startsWith: 'Bắt đầu với',
      contains: 'Chứa',
      notContains: 'Không chứa',
      endsWith: 'Kết thúc với',
      equals: 'Bằng',
      notEquals: 'Không bằng',
      noFilter: 'Không lọc',
      dateIs: 'Ngày bằng',
      dateIsNot: 'Ngày khác',
      dateBefore: 'Trước ngày',
      dateAfter: 'Sau ngày',
      matchAll: 'Khớp tất cả',
      matchAny: 'Khớp bất kỳ',
      dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      monthNames: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ],
      monthNamesShort: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
      today: 'Hôm nay',
      clear: 'Xóa',
      dateFormat: 'dd/mm/yy',
      firstDayOfWeek: 1,
    });
    forkJoin({
      evaluators: this.evaluatorService.getAllCheckTargets(),
      converts: this.convertService.query(),
      frequencies: this.frequencyService.getAllCheckFrequency(),
      account: this.accountService.identity(),
    }).subscribe(({ evaluators, converts, frequencies, account }) => {
      this.evaluators = evaluators;
      this.listEvalReportBase = converts.body;
      this.listOfFrequency = frequencies;
      this.account = account;
    });
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.plans || this.plans.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  hasAnyAuthority(authorities: string[]): boolean {
    return this.accountService.hasAnyAuthority(authorities);
  }

  validDisplayButton(data: any, role: any[]) {
    if (data.status === 'Đã hoàn thành' || data.status === 'Chưa hoàn thành') {
      return false;
    }
    const isAdmin = this.hasAnyAuthority(role);
    return isAdmin;
  }

  duplicateNameValidator(name: string | null, index: number): void {
    if (!name) {
      this.isNameDuplicate[index] = false;
      return;
    }
    this.planGrService.checkNameExists(name).subscribe({
      next: isDuplicate => {
        this.isNameDuplicate[index] = isDuplicate;
      },
      error: () => {
        this.isNameDuplicate[index] = false;
      },
    });
  }

  loadEvalTable(planId: number) {
    this.planGrService.findAllPlanGrByReportId(planId).subscribe(res => {
      this.planEvaluations = res.body || [];
      this.planEvaluations = this.planEvaluations
        .filter((item: any) => item.type === 'single')
        .map((item: any) => {
          const dateOnly = item.checkDate ? new Date(item.checkDate) : '';
          return {
            ...item,
            checkDate: dateOnly,
          };
        });
      if (this.planEvaluations.length === 0) {
        this.planEvaluations.push({ name: this.generateName(this.account.login), checkDate: new Date() });
      }
    });
  }

  onPage(event: any) {
    const page = event.first / event.rows;
    const size = event.rows;
    this.currentPage = page;
    this.size = size;
    this.load(page, size);
  }

  onPageSizeChange(event: any): void {
    this.selectedPageSize = event.rows;
    this.first = event.first;
  }

  onSearch() {
    this.load(0, this.size);
  }

  delete(plan: IPlan): void {
    const modalRef = this.modalService.open(PlanDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.plan = plan;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(page: number = 0, size: number = 10): void {
    this.isLoading = true;
    this.planService.query(this.filter, page, size).subscribe({
      next: res => {
        this.totalRecords = res.totalElements;
        this.planDetailResults = res.content || [];
        this.planDetailResults = this.planDetailResults.map(item => {
          return {
            ...item,
            timeStart: new Date(item.timeStart),
            timeEnd: new Date(item.timeEnd),
            createdAt: new Date(item.createdAt),
          };
        });
        this.isLoading = false;
      },
      error: err => console.error(err),
    });
  }

  // Sao chép kế hoạch
  copyPlan(plan: any): void {
    this.router.navigate([`/plan/${plan}/edit`], {
      state: {
        mode: 'COPY', // Add mode flag
      },
    });
  }

  navigateToInspectionReport(): void {
    // modal.dismiss();
    this.router.navigate(['inspection-report']);
  }

  navigateToGrossScript(): void {
    this.router.navigate(['gross-script']);
  }

  navigateToScript(): void {
    this.router.navigate(['script']);
  }

  navigateToSummarizePlan(): void {
    this.router.navigate(['summarize-plan']);
  }

  // onRowExpand(event: any): void {
  //   if (this.dt2 && this.dt2.paginator) {
  //     this.currentPage = this.dt2.first / this.dt2.rows;
  //   }
  //   const rowData = event.data;
  //   this.expandedRows[rowData.id] = true;
  //   this.loadPlanDetails(rowData.id);
  // }

  onRowExpand(event: any): void {
    const rowData = event.data;
    this.expandedRows[rowData.id] = true;
    this.loadPlanDetailsByPlanId(rowData.id);
    // Cập nhật dữ liệu cho planDetail của hàng đang mở rộng

    // Không cần gọi loadPlanDetails() nữa
  }

  restorePaginatorState() {
    if (this.dt2 && this.dt2.paginator) {
      this.dt2.first = this.currentPage * this.dt2.rows;
      // Kích hoạt lại phân trang để nó áp dụng trạng thái mới
      this.dt2.onLazyLoad.emit({
        first: this.dt2.first,
        rows: this.dt2.rows,
        sortField: this.dt2.sortField,
        sortOrder: this.dt2.sortOrder,
        filters: this.dt2.filters,
        globalFilter: this.dt2.globalFilter,
      });
    }
  }

  loadPlanDetailsByPlanId(planId: number): void {
    this.planService.getAllStatisReportByPlanId(planId).subscribe((res: any) => {
      res.body.forEach((detail: any) => {
        const evaluator = this.evaluators.find(evalua => evalua.username === detail.checker);
        if (evaluator) {
          detail.reviewer = evaluator.name;
        }
        this.planDetailResults[this.planDetailResults.findIndex(item => item.id === planId)].planDetail = res.body;
      });
      this.loadTreeNodes();
      this.cdr.detectChanges();
    });
  }

  onRowCollapse(event: any): void {
    const rowData = event.data;
    delete this.expandedRows[rowData.id];
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  loadTreeNodes(): void {
    if (this.planDetailResults) {
      this.treeNodes = this.planDetailResults.map(plan => ({
        data: {
          id: plan.id,
          code: plan.code,
          name: plan.name,
          subjectOfAssetmentPlan: plan.subjectOfAssetmentPlan,
          frequency: plan.frequency,
          timeStart: plan.timeStart,
          timeEnd: plan.timeEnd,
          statusPlan: plan.statusPlan,
          testObject: plan.testObject,
          reportTypeId: plan.reportTypeId,
          reportTypeName: plan.reportTypeName,
          numberOfCheck: plan.numberOfCheck,
          implementer: plan.implementer,
          paticipant: plan.paticipant,
          checkerGroup: plan.checkerGroup,
          checkerName: plan.checkerName,
          checkerGroupId: plan.checkerGroupId,
          checkerId: plan.checkerId,
          gross: plan.gross,
          timeCheck: plan.timeCheck,
          nameResult: plan.nameResult,
          scriptId: plan.scriptId,
          createBy: plan.createBy,
          status: plan.status,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
          updateBy: plan.updateBy,
        },
        children: [],
        expanded: false,
      }));
    }
  }

  onGlobalSearch(event: any): void {
    this.dt2.filterGlobal(event.target.value, 'contains');
  }

  showDialogCheckPlan(data: any, index: number): void {
    this.planParent = data;
    this.report = data.planDetail[index];
    if (this.isMobile) {
      this.report.reviewer = this.evaluators.find(evalua => evalua.username == this.report.checker).name;
    }
    this.loadEvalTable(data.planDetail[index].id);
    this.minSelectableDate = new Date(this.planParent.timeStart);
    this.maxSelectableDate = new Date(this.planParent.timeEnd);
    this.minSelectableDate.setHours(0, 0, 0, 0);
    this.maxSelectableDate.setHours(23, 59, 59, 999);
    this.dialogCheckPlan = true;
  }

  showDialogCheckPlanChild(data: any): void {
    // // Lấy kiểu đánh giá tương ứng với BBKT
    data.createdBy = this.account.login;
    data.checker = this.report.checker;
    this.planGroup = data;
    this.listEvalReports = this.listEvalReportBase.filter((item: any) => item.type === this.report.convertScore);
    if (data.id) {
      this.planGrService.findAllDetail(data.id).subscribe(res => {
        this.planGrDetail = res.body.map((item: any) => {
          return {
            ...item,
            image: JSON.parse(item.image),
            result: item.hasEvaluation == 0 ? item.result : item.result ?? (this.report.convertScore === 'Tính điểm' ? 'PASS' : 'Đạt'),
          };
        });
        this.IsHasRemediationPlan = this.planGrDetail.some(item => item.fixed === 1);
      });
    } else {
      this.report.detail = typeof this.report.detail === 'string' ? JSON.parse(this.report.detail) : this.report.detail;
      this.planGrDetail = this.report.detail.body.map((row: any) => {
        const criterialGroup = row.data.find((item: any) => item.index === 1)?.value || '';
        const criterial = row.data.find((item: any) => item.index === 2)?.value || '';
        return {
          criterialGroupName: criterialGroup,
          criterialName: criterial,
          createdBy: data.createdBy,
          frequency: row.frequency,
          result: row.hasEvaluation == 0 ? row.result : row.result ?? (this.report.convertScore === 'Tính điểm' ? 'PASS' : 'Đạt'),
        };
      });
      this.IsHasRemediationPlan = this.planGrDetail.some(item => item.fixed === 1);
    }
    this.dialogCheckPlanChild = true;
  }

  showDialogGeneralCheckPlan(Parentdata: any, data: any): void {
    this.reportSelected = data;
    this.reportService.getAllStatisticalByReportId(Parentdata.id, data.id).subscribe(res => {
      this.checkPlanDetails = res.body;
    });
    this.dialogGeneralCheckPlan = true;
  }

  showDialogSummaryOfCriteriaConclusion(data: any): void {
    this.planGrService.findAllDetailByHistoryAndReportId(data.planGroupHistoryId, this.reportSelected.id).subscribe(res => {
      this.criteriaSummaries = res.body;
      this.criteriaSummaries.sort((a: any, b: any) => {
        if (a.criterialGroupName < b.criterialGroupName) return -1;
        if (a.criterialGroupName > b.criterialGroupName) return 1;
        return 0;
      });
    });
    this.dialogSummaryOfCriteriaConclusion = true;
  }

  getSeverity(status: string): any {
    switch (status) {
      case 'Đã hoàn thành':
        return 'success';
      case 'Chưa hoàn thành':
        return 'danger';
      case 'Đang thực hiện':
        return 'warning';
      case 'Mới tạo':
        return 'info';
    }
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.plans = this.refineData(dataFromBody);
    // this.treeNodes = this.transformToTreeNodes(this.plans); // Transform to TreeNode
    this.convertPlansToTreeNodes();
  }

  protected convertPlansToTreeNodes(): void {
    if (this.plans) {
      this.treeNodes = this.plans.map(plan => ({
        data: plan,
        children: [],
      }));
    }
  }

  protected onResponseSuccess2(response: EntityArrayResponseType): void {
    const dataFromServer = this.fillComponentAttributesFromResponseBody(response.body);
    this.plans = dataFromServer;
  }

  protected refineData(data: IPlan[]): IPlan[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IPlan[] | null): IPlan[] {
    return data ?? [];
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }

  protected transformToTreeNodes(plans: IPlan[]): TreeNode[] {
    return plans.map(plan => ({
      data: plan,
      children: [],
    }));
  }

  generateName(username: string): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${username}-${day}${month}${year}${hours}${minutes}${seconds}`;
  }

  addRowPlanEvaluation(): void {
    this.planEvaluations.push({ name: this.generateName(this.account.login), checkDate: new Date() });
  }

  deletePlanChild(data: any, index: number): void {
    if (data && data.length > 0) {
      if (data[index].id) {
        this.planGrService.delete(data[index].id).subscribe({
          next: () => {
            console.log('Xóa thành công kế hoạch con');
            data.splice(index, 1);
          },
          error: error => {
            console.error('Lỗi khi xóa kế hoạch con:', error);
          },
        });
      } else {
        data.splice(index, 1);
      }
    }
  }

  // region
  // xử lý uploda file
  showDialogUpLoad(data: any, rowIndex: number): void {
    data.image = typeof data.image == 'string' ? JSON.parse(data.image) : data.image;
    if (!Array.isArray(data.image)) {
      data.image = [];
    }
    this.selectedData = data;
    this.dialogVisibility[rowIndex] = !this.dialogVisibility[rowIndex];
    this.imageLoadErrors.clear();
    this.cdr.detectChanges();
  }

  isImage(fileName: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? imageExtensions.includes(extension) : false;
  }

  isVideo(fileName: string): boolean {
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv'];
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? videoExtensions.includes(extension) : false;
  }

  getImageUrl(fileName: string): string {
    return 'content/images/bbkt/' + fileName;
  }

  getVideoUrl(fileName: string): string {
    return 'content/videos/bbkt/' + fileName;
  }

  onFileSelect(event: any, data: any, index: number): void {
    const files: File[] = Array.from(event.files);
    const dataKey = data.reportCode + '-' + index;
    const existing = this.selectedFiles.find(item => item.dataKey === dataKey);
    if (existing) {
      existing.files = [...existing.files, ...files];
    } else {
      this.selectedFiles.push({ dataKey, files });
    }
    if (!Array.isArray(data.image)) {
      data.image = [];
    }
    const existingNames = new Set(data.image);
    for (const file of files) {
      // Logic đã sửa để gọi API upload
      this.planService.upload(file).subscribe(
        (response: any) => {
          const fileName = response.fileName; // Lấy tên file từ response của backend
          if (!existingNames.has(fileName)) {
            data.image.push(fileName);
            existingNames.add(fileName);
          }
          this.cdr.detectChanges();
        },
        (error: any) => {
          console.error('Upload failed:', error);
        },
      );
    }
  }

  // Phương thức xóa file cập nhật
  deleteFile(filename: string, data: any): void {
    const index = data.image.indexOf(filename);
    if (index > -1) {
      data.image.splice(index, 1);
      this.planService.deleteFile(filename).subscribe(
        response => {
          console.log('File deleted successfully:', response);
          this.cdr.detectChanges();
        },
        error => {
          console.error('Failed to delete file:', error);
          // Xử lý lỗi nếu cần
        },
      );
    }
  }

  removeImg(event: any, data: any) {
    const index = data.image.indexOf(event.file.name);
    if (index > -1) {
      data.image.splice(index, 1);
    }
  }

  onClear(data: any): void {
    if (data) {
      data.image = [];
    }
  }

  onImageError(fileName: string) {
    this.imageLoadErrors.add(fileName);
    this.cdr.detectChanges();
  }

  getTimestamp(): number {
    return Date.now();
  }

  sanitizeFileName(filename: string): string {
    return filename
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_\-\.]/g, '');
  }

  generateCode(planId: number): string {
    const uid = window.crypto?.randomUUID?.() || this.fallbackUUID();
    const currentDate = dayjs().format('DDMMYYYYHHmmssSSS');
    return `PG-${planId}-${uid}-${currentDate}`;
  }

  private fallbackUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      // eslint-disable-next-line no-bitwise
      const r = (Math.random() * 16) | 0;
      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  savePlanGr(data: any) {
    data.code = this.generateCode(this.planParent.id);
    data.planId = this.planParent.id;
    data.checkDate = dayjs(data.checkDate).toISOString();
    data.type = 'single';
    data.createdAt = dayjs();
    data.status = 'Mới tạo';
    this.planService.createGroupHistory(data).subscribe(res => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'center-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen(toast) {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'success',
        title: 'Lưu dữ liệu thành công',
      });
      this.loadEvalTable(this.report.id);
    });
  }

  async savePlanGrAndDetail() {
    // Gán các giá trị khởi tạo nếu là tạo mới
    if (this.planGroup.id === undefined || this.planGroup.id === null) {
      this.planGroup.code = this.generateCode(this.planParent.id);
      this.planGroup.planId = this.planParent.id;
      this.planGroup.checkDate = dayjs(this.planGroup.checkDate).toISOString();
      this.planGroup.type = 'single';
      this.planGroup.createdAt = dayjs();
      this.planGroup.status = 'Mới tạo';
    } else {
      this.planGroup.checkDate = dayjs(this.planGroup.checkDate).toISOString();
      if (this.planGroup.status !== 'Đang thực hiện') {
        this.planGroup.status = 'Đang thực hiện';
      }
    }
    try {
      const res = await this.planService.createGroupHistory(this.planGroup).toPromise();
      const arrRptGrDetail = this.planGrDetail.map(item => ({
        ...item,
        createdAt: this.planGroup.checkDate,
        createdBy: this.planGroup.createdBy,
        planGroupHistoryId: res.body,
        reportId: this.report.id,
        reportName: this.report.name,
        status: item.result != null || item.hasEvaluation == 0 ? 'Đang thực hiện' : 'Mới tạo',
        convertScore: this.report.convertScore,
        image: JSON.stringify(item.image),
      }));
      const arrCriterialFix = arrRptGrDetail.filter(item => item.fixed == 1);
      const planFix = {
        code: `RP-FIXAUTO-${this.report.id}-${this.fallbackUUID()}`,
        name: `AUTO FIX - ${this.account.login}-${dayjs().toISOString()}`,
        reportId: this.report.id,
        planId: this.planParent.id,
        repairDate: dayjs().toISOString(),
        createdAt: dayjs().toISOString(),
        createdBy: this.account.login,
        type: 'single',
        status: 'Đã hoàn thành',
        details: arrCriterialFix,
      };
      if (arrCriterialFix.length > 0) {
        if (this.IsHasRemediationPlan) {
          const result = await Swal.fire({
            title: 'Bạn có muốn lưu khắc phục vào kế hoạch trước đó?',
            showCancelButton: true,
            confirmButtonText: 'Lưu vào kế hoạch cũ',
            cancelButtonText: 'Bỏ qua',
            reverseButtons: true,
          });
          if (result.isConfirmed) {
            await this.remediationPlanService.createAutoPlanFix(planFix).toPromise();
          } else if (result.isDismissed) {
            console.log('Người dùng không lưu vào kế hoạch trước đó');
          }
        } else {
          await this.remediationPlanService.createAutoPlanFix(planFix).toPromise();
        }
      }
      const uploadPromises = this.selectedFiles.flatMap(fileGroup =>
        fileGroup.files.map(file => {
          const safeFileName = this.sanitizeFileName(file.name);
          const safeFile = new File([file], safeFileName, { type: file.type });
          return this.planService.upLoadFile(safeFile).toPromise();
        }),
      );
      await Promise.all(uploadPromises);
      this.planGroup.id = res.body;
      if (this.planGroup.status !== 'Đang thực hiện') {
        this.planGroup.status = 'Đang thực hiện';
      }
      if (arrRptGrDetail.length > 0) {
        await this.planService.createGroupHistoryDetail(arrRptGrDetail).toPromise();
      }
      if (this.report.status == 'Mới tạo') {
        this.report.detail = typeof this.report.detail === 'string' ? this.report.detail : JSON.stringify(this.report.detail);
        this.report.status = 'Đang thực hiện';
        this.report.createdAt = dayjs(this.report.createdAt);
        this.report.updatedAt = dayjs();
        await this.reportService.update(this.report).toPromise();
      }
      if (this.planParent.status == 'Mới tạo') {
        this.planParent.status = 'Đang thực hiện';
        this.planParent.timeStart = dayjs(this.planParent.timeStart);
        this.planParent.timeEnd = dayjs(this.planParent.timeEnd);
        this.planParent.createdAt = dayjs(this.planParent.createdAt);
        this.planParent.updatedAt = dayjs();
        await this.planService.update(this.planParent).toPromise();
      }
      const Toast = Swal.mixin({
        toast: true,
        position: 'center-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen(toast) {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'success',
        title: 'Lưu dữ liệu thành công',
      });
      this.loadEvalTable(this.report.id);
      this.dialogCheckPlanChild = false;
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
      Swal.fire('Lỗi', 'Đã xảy ra lỗi khi lưu dữ liệu.', 'error');
    }
  }

  onChangeFix(data: any) {
    console.log(data);
    if (!this.IsHasRemediationPlan) return;
    if (data.fixed == 0) {
      Swal.fire({
        title: 'Bạn có muốn xóa tiêu trí này khỏi kế hoạch khắc phục?',
        showCancelButton: true,
        confirmButtonText: `Delete`,
        cancelButtonText: `Cancel`,
      }).then(result => {
        if (result.value) {
          this.remediationPlanService
            .deleteCriteriaAuto(data.id, data.reportId, data.criterialName, data.criterialGroupName)
            .subscribe(() => {
              const Toast = Swal.mixin({
                toast: true,
                position: 'center-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen(toast) {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                },
              });
              Toast.fire({
                icon: 'success',
                title: 'Xóa dữ liệu thành công',
              });
            });
        }
      });
    }
  }

  // Xuất excel
  exportSingleItemToExcel(selectedParentItem: any): void {
    if (!selectedParentItem || !selectedParentItem.id) {
      console.error('Không có dữ liệu cha hợp lệ để xuất Excel.');
      return;
    }

    // Bước 1: Tải dữ liệu con cho thằng cha được chọn
    this.planService.getAllStatisReportByPlanId(selectedParentItem.id).subscribe(res => {
      const details = res.body || [];
      this.generateExcelFile(selectedParentItem, details);
    });
  }

  /**
   * Tạo và xuất file Excel từ dữ liệu cha và con.
   * @param parentData Đối tượng PlanGroupHistory (cha).
   * @param childDetails Mảng các đối tượng PlanGroupHistoryDetail (con).
   */
  private generateExcelFile(parentData: any, childDetails: any[]): void {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

    // --- Cấu hình tiêu đề cho dữ liệu cha ---
    const parentHeaderRow = [
      'ID Kế hoạch',
      'Mã Kế hoạch',
      'Tên Kế hoạch',
      'Đối tượng đánh giá',
      'Tần suất',
      'Thời gian bắt đầu',
      'Thời gian kết thúc',
    ];

    // --- Cấu hình tiêu đề cho dữ liệu chi tiết ---
    const detailHeaderRow = [
      '', // Cột trống để thụt lề
      'Mã BBKT',
      'Tên BBKT',
      'Tổ được kiểm tra',
      'Người được kiểm tra',
      'Loại BBKT',
      'Số lần thực hiện kiểm tra',
      'Thang điểm',
      'Tổng điểm TB của BBKT',
      'Tổng điểm của BBKT',
      'Loại quy đổi',
      'NC',
      'LC',
      'Số lượng không đạt',
      'Người kiểm tra',
      'Tần suất',
      'Trạng thái',
    ];

    // --- Dữ liệu cha ---
    let currentRowIndex = 0; // Theo dõi hàng hiện tại

    XLSX.utils.sheet_add_aoa(ws, [['Dữ liệu Kế hoạch Kiểm tra']], { origin: -1 });
    currentRowIndex++;

    XLSX.utils.sheet_add_aoa(ws, [parentHeaderRow], { origin: -1 });
    currentRowIndex++;

    const parentDataRow = [
      parentData.id,
      parentData.code,
      parentData.name,
      parentData.subjectOfAssetmentPlan,
      parentData.frequency,
      parentData.timeStart, // Giữ nguyên chuỗi ISO 8601
      parentData.timeEnd, // Giữ nguyên chuỗi ISO 8601
    ];
    XLSX.utils.sheet_add_aoa(ws, [parentDataRow], { origin: -1 });
    currentRowIndex++;

    // --- Dữ liệu con ---
    XLSX.utils.sheet_add_aoa(ws, [['']], { origin: -1 }); // Hàng trống
    currentRowIndex++;

    XLSX.utils.sheet_add_aoa(ws, [['Chi tiết Kế hoạch Kiểm tra']], { origin: -1 });
    currentRowIndex++;

    if (childDetails && childDetails.length > 0) {
      XLSX.utils.sheet_add_aoa(ws, [detailHeaderRow], { origin: -1 });
      currentRowIndex++;

      childDetails.forEach(detail => {
        const detailDataRow = [
          '', // Cột thụt lề
          detail.code,
          detail.name,
          detail.groupName,
          detail.testOfObject,
          detail.reportType,
          detail.sumOfAudit,
          detail.scoreScale,
          this.getTotalPoitAvg(detail), // Gọi hàm tính toán
          this.getTotalPoint(detail), // Gọi hàm tính toán
          detail.convertScore,
          detail.sumOfNc,
          detail.sumOfLy,
          detail.sumOfFail,
          detail.checker,
          detail.frequency,
          detail.status,
        ];
        XLSX.utils.sheet_add_aoa(ws, [detailDataRow], { origin: -1 });
        currentRowIndex++;
      });
    } else {
      XLSX.utils.sheet_add_aoa(ws, [['Không có dữ liệu chi tiết cho kế hoạch này.']], { origin: -1 });
      currentRowIndex++;
    }

    // --- CẤU HÌNH ĐỘ RỘNG CỘT TỰ ĐỘNG VÀ ĐỊNH DẠNG ---

    // Đây là phần quan trọng để làm đẹp cột
    // Cấu hình độ rộng cho các cột của dữ liệu cha và con
    // Các số là độ rộng ký tự (character width)
    const columnWidthsParent = [
      { wch: 10 }, // ID Kế hoạch
      { wch: 25 }, // Mã Kế hoạch
      { wch: 30 }, // Tên Kế hoạch
      { wch: 25 }, // Đối tượng đánh giá
      { wch: 15 }, // Tần suất
      { wch: 25 }, // Thời gian bắt đầu (cho chuỗi ngày giờ đầy đủ)
      { wch: 25 }, // Thời gian kết thúc (cho chuỗi ngày giờ đầy đủ)
    ];

    const columnWidthsDetail = [
      { wch: 5 }, // Cột trống thụt lề
      { wch: 15 }, // Mã BBKT
      { wch: 25 }, // Tên BBKT
      { wch: 25 }, // Đối tượng kiểm tra
      { wch: 15 }, // Loại BBKT
      { wch: 25 }, // Số lần thực hiện kiểm tra
      { wch: 15 }, // Thang điểm
      { wch: 15 }, // Tổng điểm
      { wch: 18 }, // Loại quy đổi
      { wch: 8 }, // NC
      { wch: 8 }, // LC
      { wch: 18 }, // Số lượng không đạt
      { wch: 20 }, // Người kiểm tra
      { wch: 15 }, // Tần suất
      { wch: 15 }, // Trạng thái
    ];

    // Gán độ rộng cột cho worksheet
    // Lưu ý: ws['!cols'] sẽ áp dụng cho toàn bộ các cột.
    // Nếu bạn muốn độ rộng khác nhau cho phần cha và con, bạn sẽ phải tạo 2 sheet riêng biệt.
    // Với 1 sheet, bạn phải chọn độ rộng lớn nhất hoặc phù hợp nhất cho mỗi cột.
    // Ở đây, tôi sẽ gộp các cấu hình độ rộng.
    // Giả định số lượng cột tối đa là số cột của detailHeaderRow
    const maxCols = Math.max(parentHeaderRow.length, detailHeaderRow.length);
    const commonColumnWidths: XLSX.ColInfo[] = [];

    for (let i = 0; i < maxCols; i++) {
      let width = 10; // Default width
      if (columnWidthsParent[i] && columnWidthsParent[i].wch) {
        width = Math.max(width, columnWidthsParent[i].wch || 0);
      }
      if (columnWidthsDetail[i] && columnWidthsDetail[i].wch) {
        width = Math.max(width, columnWidthsDetail[i].wch || 0);
      }
      commonColumnWidths.push({ wch: width });
    }

    ws['!cols'] = commonColumnWidths;

    // --- Định dạng cho các ô Header (in đậm) ---
    // Để in đậm tiêu đề, bạn cần truy cập trực tiếp vào các ô (cells) và gán thuộc tính 's' (style)
    // Điều này phức tạp hơn với aoa_to_sheet. Cách đơn giản hơn là sau khi tạo sheet, bạn lặp qua các ô header.
    // Với cấu trúc hiện tại, chúng ta sẽ biết các hàng header nằm ở đâu.

    // Header Cha: Hàng 1 (index 1)
    parentHeaderRow.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: colIndex }); // Hàng 1, cột 0, 1, 2...
      if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: parentHeaderRow[colIndex] };
      if (!ws[cellAddress].s) ws[cellAddress].s = {};
      ws[cellAddress].s.font = { bold: true };
    });

    // Header Con: Hàng ngay sau tiêu đề "Chi tiết Kế hoạch Kiểm tra"
    // (Giả định nằm ở hàng 'currentRowIndex - childDetails.length - 1' sau khi thêm detail data)
    // Tốt hơn là lưu trữ chỉ số hàng cụ thể của header khi nó được thêm vào
    let detailHeaderRowIndex = 0;
    // Tìm chỉ số hàng của "Chi tiết Kế hoạch Kiểm tra"
    for (let r = 0; r < currentRowIndex; r++) {
      const cell = ws[XLSX.utils.encode_cell({ r: r, c: 0 })];
      if (cell && cell.v === 'Chi tiết Kế hoạch Kiểm tra') {
        detailHeaderRowIndex = r + 1; // Header con sẽ nằm ở hàng tiếp theo
        break;
      }
    }
    if (detailHeaderRowIndex > 0) {
      detailHeaderRow.forEach((_, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: detailHeaderRowIndex, c: colIndex });
        if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: detailHeaderRow[colIndex] };
        if (!ws[cellAddress].s) ws[cellAddress].s = {};
        ws[cellAddress].s.font = { bold: true };
      });
    }

    // --- Tạo và xuất workbook ---
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Chi tiết Kế hoạch');

    const fileName = `ChiTietKeHoach_${parentData.code || parentData.id}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  getTotalPoitAvg(data: any) {
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

  converTotalPointError(data: any) {
    const markNC = this.listEvalReportBase.find((item: any) => item.name == 'NC');
    const markLC = this.listEvalReportBase.find((item: any) => item.name == 'LY');
    const totalPointError = data.sumOfLy * markLC.mark + data.sumOfNc * markNC.mark;
    return data.convertScore == 'Tính điểm' ? totalPointError : data.sumOfFail;
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

  showDialogViewImg(data: any) {
    this.listImgReports = JSON.parse(data);
    this.dialogViewImage = true;
  }

  exportExcel(reportId: number) {
    this.exportExcelService.exportToExcel(reportId);
  }

  closeEvalReport(data: any) {
    this.dialogCheckPlan = false;
    this.loadPlanDetailsByPlanId(data.id);
  }

  onFrequencySelect(selectedFrequencies: string[]): void {
    if (!selectedFrequencies) selectedFrequencies = [];
    this.planGrDetail.forEach(report => {
      if (selectedFrequencies.length === 0 || !selectedFrequencies.includes(report.frequency)) {
        report.hasEvaluation = 1;
      } else {
        report.hasEvaluation = 0;
        report.result = null;
        report.note = '';
        report.image = [];
      }
    });
  }

  onEvaluationToggle(item: any): void {
    if (item.hasEvaluation === 0) {
      item.result = null;
      item.note = '';
      item.image = []; // hoặc null, tùy theo kiểu dữ liệu
    }
    this.updateCheckAllStatus();
  }

  toggleAllEvaluations() {
    this.planGrDetail.forEach(report => {
      report.hasEvaluation = this.checkAll ? 0 : 1;
      if (report.hasEvaluation === 0) {
        report.result = null;
        report.note = '';
        report.image = []; // hoặc null, tùy theo kiểu dữ liệu
      }
      // this.onEvaluationToggle(report);
    });
  }

  updateCheckAllStatus() {
    this.checkAll = this.planGrDetail.every(report => report.hasEvaluation === 0);
  }

  // Mobile funcition
  showListReport(plan: any) {
    this.dialogListReportByPlan = true;
    this.selectedPlan = plan;
    this.planService.getAllStatisReportByPlanId(plan.id).subscribe(res => {
      this.listReportByPlan = res.body;
      this.selectedPlan.planDetail = this.listReportByPlan;
      this.listReportByPlan = this.listReportByPlan.map((item: any) => {
        return { ...item, reviewer: this.evaluators.find(evalua => evalua.username == item.checker).name };
      });
    });
  }

  openNoteDialog(report: any, index: number): void {
    if (report.hasEvaluation === 0) return;
    this.selectedReport = report;
    this.noteDialogVisible = true;
  }

  handleEnter(event: any): void {
    event.preventDefault();
    this.noteDialogVisible = false;
  }
}
