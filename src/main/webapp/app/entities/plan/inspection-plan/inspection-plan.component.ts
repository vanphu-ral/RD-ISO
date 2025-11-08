import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { SortByDirective, SortDirective } from 'app/shared/sort';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { GalleriaModule } from 'primeng/galleria';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { FrequencyService } from 'app/entities/frequency/service/frequency.service';
import { CheckTargetService } from 'app/entities/check-target/service/check-target.service';
import { take } from 'rxjs';
import { PlanService } from '../service/plan.service';
import { ReportService } from 'app/entities/report/service/report.service';
import { EvaluatorService } from 'app/entities/evaluator/service/evaluator.service';
import dayjs from 'dayjs/esm';
import { RemediationPlanService } from '../service/remediationPlan.service';
import Swal from 'sweetalert2';
import { TagModule } from 'primeng/tag';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { LayoutService } from 'app/layouts/service/layout.service';
import { PlanGroupService } from 'app/entities/plan-group/service/plan-group.service';

@Component({
  selector: 'jhi-inspection-report',
  standalone: true,
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
    GalleriaModule,
    DialogModule,
    FileUploadModule,
    TagModule,
    HasAnyAuthorityDirective,
  ],
  templateUrl: './inspection-plan.component.html',
  styleUrl: './inspection-plan.component.scss',
})
export class InspectionPlanComponent implements OnInit {
  plan: any = {};
  listReportCriterialErrors: any[] = [];
  listRemediationPlan: any[] = [];
  processedReportData: any[] = [];
  dialogUpdateRemePlan: boolean = false;
  dialogRepairCriterial: boolean = false;
  dialogCheckCriterial: boolean = false;
  groupCriterialError: any = {};
  remediationPlanSelected: any = {};
  evaluator: any[] = [];
  selectedRows: any[] = [];
  listCriterialRepair: any[] = [];
  selectedFiles: { dataKey: string; files: File[] }[] = [];
  imageLoadErrors = new Set<string>();
  selectedData: any = null;
  dialogVisibility: { [key: string]: boolean } = {};
  criterialSelected: any = {};
  listReCheckRemediationPlan: any[] = [];
  isNameDuplicate: boolean = false;
  completeRemePlan: any[] = [];
  selectedRecheckCriterial: any[] = [];
  remediationPlanInfo: any = {};
  completeRemeDialog: boolean = false;
  disableCheckComplete: boolean = false;
  listImgReports: any[] = [];
  dialogViewImage: boolean = false;

  // Mobile availible
  isMobile: boolean = false;
  editDialogVisible = false;
  selectedRow: any = null;
  editField: 'solution' | 'description' | null = null;
  editDialogVisibleRepair = false;
  selectedRowRepair: any = null;
  editFieldRepair: 'note' | 'reason' | null = null;
  listUserHander: any[] = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    private planService: PlanService,
    private evaluatorService: EvaluatorService,
    private remediationPlanService: RemediationPlanService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private layoutService: LayoutService,
    private planGrHistoryDetailService: PlanGroupService,
    private reportService: ReportService,
    private checkTargetService: CheckTargetService,
  ) {}

  ngOnInit(): void {
    this.layoutService.isMobile$.subscribe(value => {
      this.isMobile = value;
    });
    this.evaluatorService.getAllCheckTargets().subscribe(res1 => {
      this.checkTargetService.getAllCheckTargets().subscribe(res2 => {
        this.evaluator = [...res1, ...res2];
        this.listUserHander = res2;
      });
    });
    this.activatedRoute.data.pipe(take(1)).subscribe(({ plan }) => {
      this.plan = plan;
      // Gọi tât cả các dữ liệu đánh giá của các bbkt có trong plan
      this.planService.getAllPlanGroupHistoryDetailsByPlanId(plan.id).subscribe(res => {
        this.listReportCriterialErrors = res.body.filter(
          (item: any) => item.result == 'NC' || item.result == 'LY' || item.result == 'Không đạt',
        );
        this.groupAndProcessData();
      });
      // get dữ liệu table kế hoạch khắc phục
      this.reloadRemediationTableData(plan.id);
    });
  }

  duplicateNameValidator(name: string | null): void {
    if (!name) {
      this.isNameDuplicate = false;
      return;
    }
    this.remediationPlanService.checkNameExistsByPlan(name, this.plan.id).subscribe({
      next: isDuplicate => {
        this.isNameDuplicate = isDuplicate;
      },
      error: () => {
        this.isNameDuplicate = false;
      },
    });
  }

  // region
  // format dữ liệu hiển thị
  groupAndProcessData(): void {
    const groupedData: { [key: string]: any } = {};
    this.listReportCriterialErrors.forEach(item => {
      const key = `${item.reportId}-${item.reportName}-${item.criterialGroupName}-${item.criterialName}-${item.convertScore}-${item.result}-${item.frequency}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          reportId: item.reportId,
          reportName: item.reportName,
          criterialGroupName: item.criterialGroupName,
          criterialName: item.criterialName,
          convertScore: item.convertScore,
          result: item.result,
          frequency: item.frequency,
          createdDates: [],
          rowspan: 0,
        };
      }
      groupedData[key].createdDates.push(item.createdAt);
    });
    // this.processedReportData = Object.values(groupedData).map(row => {
    //   row.rowspan = row.createdDates.length;
    //   row.createdDates.sort((a: any, b: any) => new Date(a).getTime() - new Date(b).getTime());
    //   return row;
    // });
    // this.processedReportData.sort((a, b) => {
    //   if (a.reportId !== b.reportId) {
    //     return a.reportId - b.reportId;
    //   }
    //   if (a.reportName !== b.reportName) {
    //     return a.reportName.localeCompare(b.reportName);
    //   }
    //   return 0;
    // });
    this.loadCriterialErrr();
  }

  loadCriterialErrr() {
    this.planGrHistoryDetailService.getRecheckDetailPlan(this.plan.id, '', '', 0, 10).subscribe(res => {
      this.processedReportData =
        res.body?.content.filter((item: any) => item.result != 'Đạt' && item.statusRecheck != 'Đã hoàn thành') || [];
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  // EndRegion

  onCreatedByChange(newCreatedBy: string) {
    this.groupCriterialError.createdBy = newCreatedBy;
    for (let row of this.processedReportData) {
      if (!row.userHandle || row.userHandle.trim() === '') {
        row.userHandle = newCreatedBy;
      }
    }
  }

  reloadRemediationTableData(id: number) {
    this.remediationPlanService.getListByPlanId(id).subscribe(res => {
      this.listRemediationPlan = res.body || [];
    });
  }

  LoadlistCriterialRepairTable(id: number) {
    this.remediationPlanService.getAllRemediationPlanDetailById(id).subscribe(res => {
      this.listCriterialRepair = res.body;
    });
  }

  generateCode(): string {
    const uid = window.crypto?.randomUUID?.() || this.fallbackUUID();
    return `RP-${this.plan.id}-${uid}`;
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

  saveRemediationPlan(data: any) {
    data.code = this.generateCode();
    data.planId = this.plan.id;
    data.repairDate = dayjs(data.repairDate).toISOString();
    data.createdAt = dayjs();
    data.type = 'Multiple';
    data.status = 'Đang xử lý';
    this.remediationPlanService.create(data).subscribe(res => {
      const arrCriterialErr = this.selectedRows.map((item: any) => {
        const detail = structuredClone(item);
        delete item.result;
        delete item.errorType;
        delete item.resultRecheck;
        delete item.statusRecheck;
        delete item.subjectOfAssetmentPlan;
        delete item.sumOfRecheck;
        return {
          ...item,
          remediationPlanId: res.body,
          convertScore: item.convertScore,
          reportId: item.reportId,
          detail: JSON.stringify(detail),
          planTimeComplete: dayjs(item.planTimeComplete).toISOString(),
          createdAt: dayjs(),
          createdBy: data.createdBy,
          note: item.description,
          status: 'Đang xử lý',
        };
      });
      this.remediationPlanService.createRemediationPlanDetail(arrCriterialErr).subscribe(repo => {
        this.reloadRemediationTableData(this.plan.id);
        this.groupCriterialError = {};
        this.selectedRows = [];
        this.processedReportData = this.processedReportData.map(item => {
          return {
            ...item,
            solution: '',
            note: '',
            userHandle: null,
            planTimeComplete: null,
          };
        });
        this.toastMessageSaveSucess();
        this.dialogUpdateRemePlan = false;
      });
    });
  }

  showDialogListCriterialRepair(data: any) {
    this.remediationPlanSelected = data;
    this.LoadlistCriterialRepairTable(data.id);
    this.dialogRepairCriterial = true;
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

  showDialogCheckCriterial(data: any) {
    this.criterialSelected = data;
    this.remediationPlanService.getAllRecheckByRemeDetailId(data.id).subscribe(res => {
      this.listReCheckRemediationPlan = res.body;
      if (this.listReCheckRemediationPlan.length == 0) {
        this.listReCheckRemediationPlan.push({ status: 'Hoàn thành' });
      } else {
        this.listReCheckRemediationPlan = this.listReCheckRemediationPlan.map(item => {
          return { ...item, image: JSON.parse(item.image) };
        });
      }
    });
    this.dialogCheckCriterial = true;
  }

  async saveRemediationPlanDetail(data: any[]) {
    const arrSubmit = data
      .filter(item => item.result != null)
      .map(item => {
        return {
          remediationPlanDetailId: item.id,
          result: item.result,
          image: JSON.stringify(item.image),
          reason: item.reason,
          note: item.content,
          status: item.status,
          createdBy: item.createdBy,
          createdAt: dayjs(),
        };
      });
    await this.remediationPlanService.createRecheckRemePlan(arrSubmit).toPromise();
    await Promise.all(
      this.selectedFiles.flatMap(fileGroup =>
        fileGroup.files.map(file => {
          const safeFileName = this.sanitizeFileName(file.name);
          const safeFile = new File([file], safeFileName, { type: file.type });
          return this.planService.upLoadFile(safeFile).toPromise();
        }),
      ),
    );
    this.toastMessageSaveSucess();
    this.dialogRepairCriterial = false;
  }

  addRowListReCheck() {
    this.listReCheckRemediationPlan.push({
      result: this.criterialSelected.convertScore === 'Tính điểm' ? 'PASS' : 'Đạt',
      status: 'Hoàn thành',
    });
  }

  deleteRow(arr: any[], index: number) {
    if (arr[index]?.id) {
      this.remediationPlanService.deleteRecheckReme(arr[index]?.id).subscribe();
    }
    arr.splice(index, 1);
  }

  async saveReCheckRemePlan() {
    const arrGroup = this.listCriterialRepair.filter(
      item =>
        item.criterialGroupName === this.criterialSelected.criterialGroupName &&
        item.criterialName === this.criterialSelected.criterialName &&
        item.solution === this.criterialSelected.solution &&
        item.note === this.criterialSelected.note &&
        item.planTimeComplete === this.criterialSelected.planTimeComplete,
    );
    const result: any[] = [];
    this.listReCheckRemediationPlan.forEach(item => {
      arrGroup.forEach(ref => {
        result.push({
          ...item,
          remediationPlanDetailId: ref.id,
          image: JSON.stringify(item.image),
          createdAt: dayjs(),
          createdBy: this.criterialSelected.createdBy,
        });
      });
    });
    try {
      await this.remediationPlanService.createRemediationPlanDetail([this.criterialSelected]).toPromise();
      await this.remediationPlanService.createRecheckRemePlan(result).toPromise();
      await Promise.all(
        this.selectedFiles.flatMap(fileGroup =>
          fileGroup.files.map(file => {
            const safeFileName = this.sanitizeFileName(file.name);
            const safeFile = new File([file], safeFileName, { type: file.type });
            return this.planService.upLoadFile(safeFile).toPromise();
          }),
        ),
      );
      this.dialogCheckCriterial = false;
      this.toastMessageSaveSucess();
      this.LoadlistCriterialRepairTable(this.remediationPlanSelected.id);
    } catch (error) {
      console.error('Có lỗi xảy ra:', error);
    }
  }

  deletePlanRepair(data: any) {
    this.remediationPlanService.deleteRemePlan(data.id).subscribe(res => {
      Swal.mixin({
        toast: true,
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen(toast) {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      }).fire({
        icon: 'success',
        title: 'Xóa thành công',
      });
      this.reloadRemediationTableData(this.plan.id);
    });
  }

  showDialogComplete(data: any, isView: boolean = false) {
    this.disableCheckComplete = isView;
    this.remediationPlanInfo = data;
    this.remediationPlanService.getRemediationPlanWithFullDetails(data.id).subscribe(res => {
      this.completeRemePlan = res.body.details.map((item: any) => ({ ...item, result: JSON.parse(item.detail).result })) || [];
      this.completeRemeDialog = true;
    });
  }

  openDialogRepair() {
    this.dialogUpdateRemePlan = true;
    if (!this.groupCriterialError.repairDate) {
      const today = new Date();
      this.groupCriterialError.name = `KHKP GOP-${this.plan.subjectOfAssetmentPlan}-${today.getDate()}-${
        today.getMonth() + 1
      }-${today.getFullYear()}-${new Date().getHours()}h${new Date().getMinutes()}p`;
      this.groupCriterialError.repairDate = today.toISOString().substring(0, 10);
    }
  }

  showDialogViewImg(data: any) {
    this.listImgReports = JSON.parse(data);
    this.dialogViewImage = true;
  }

  completePlanRepair() {
    const updateRequests: any[] = this.selectedRecheckCriterial.map(cpl => {
      return {
        ...cpl,
        status: 'Đã hoàn thành',
        repairDate: dayjs(cpl.repairDate).toISOString(),
      };
    });
    const arrRecheck: any[] = this.selectedRecheckCriterial
      .flatMap(item => item.recheckDetails || [])
      .map(detail => ({ ...detail, status: 'Đã hoàn thành' }));
    if (updateRequests.length === 0 || arrRecheck.length === 0) {
      Swal.mixin({
        toast: true,
        position: 'top-end',
        icon: 'error',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        didOpen(toast) {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      }).fire({
        icon: 'error',
        title: 'Có tiêu chí đang chưa có đợt đánh giá lại',
      });
      return;
    }
    this.remediationPlanService.createRecheckRemePlan(arrRecheck).subscribe();
    this.remediationPlanService.createRemediationPlanDetail(updateRequests).subscribe(repo => {
      this.selectedRecheckCriterial.forEach(selectedCpl => {
        const index = this.completeRemePlan.findIndex(cpl => cpl.id === selectedCpl.id);
        if (index !== -1) {
          this.completeRemePlan[index].status = 'Đã hoàn thành';
        }
      });
      this.selectedRecheckCriterial = [];
      this.checkAndUpdateParentRemediationPlanStatus();
      this.loadCriterialErrr();
      this.completeRemeDialog = false;
    });
  }

  checkAndUpdateParentRemediationPlanStatus(): void {
    if (!this.remediationPlanInfo || !this.completeRemePlan || this.completeRemePlan.length === 0) {
      return;
    }
    const pendingDetails = this.completeRemePlan.filter(cpl => cpl.status !== 'Đã hoàn thành');
    if (pendingDetails.length === 0) {
      this.remediationPlanInfo.status = 'Đã hoàn thành';
      this.remediationPlanService.create(this.remediationPlanInfo).subscribe(res => {
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
          title: 'Đã hoàn thành kế hoạch',
        });
        this.reloadRemediationTableData(this.plan.id);
      });
    }
  }

  previousState(): void {
    this.router.navigate(['/plan']);
  }

  toastMessageSaveSucess() {
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
      title: 'Lưu thành công',
    });
  }

  // Mobile function
  openEditDialog(row: any, field: 'solution' | 'description') {
    if (!row || row.hasEvaluation === 0) return;
    this.selectedRow = row;
    this.editField = field;
    this.editDialogVisible = true;
  }

  openEditRepairDialog(row: any, field: 'note' | 'reason') {
    if (!row || row.hasEvaluation === 0) return;
    this.selectedRowRepair = row;
    this.editFieldRepair = field;
    this.editDialogVisibleRepair = true;
  }

  handleEnterForEditDialog(event: any): void {
    event.preventDefault();
    this.editDialogVisible = false;
  }

  handleEnterForRepairDialog(event: any): void {
    event.preventDefault();
    this.editDialogVisibleRepair = false;
  }
}
