import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { PlanGroupService } from 'app/entities/plan-group/service/plan-group.service';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { LayoutService } from 'app/layouts/service/layout.service';
import { PlanService } from '../../service/plan.service';
import { RemediationPlanService } from '../../service/remediationPlan.service';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  templateUrl: './fix-criterial.dialog.html',
  imports: [SharedModule, FormsModule, TableModule, ButtonModule, TagModule, DialogModule, FileUploadModule],
})
export class FixCriterialDialog {
  data: any;
  isMobile: boolean = false;
  listCriterialError: any[] = [];
  listCriterialRepair: any[] = [];
  listReCheckRemediationPlan: any[] = [];
  selectedFiles: { dataKey: string; files: File[] }[] = [];
  imageLoadErrors = new Set<string>();
  selectedData: any = null;
  dialogVisibility: { [key: string]: boolean } = {};
  criterialSelected: any = {};
  dialogCheckCriterial: boolean = false;
  editField: 'solution' | 'description' | null = null;
  editDialogVisibleRepair = false;
  selectedRowRepair: any = null;
  editFieldRepair: 'note' | 'reason' | null = null;
  editDialogVisible = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private layoutService: LayoutService,
    private cdr: ChangeDetectorRef,
    private planService: PlanService,
    private remediationPlanService: RemediationPlanService,
  ) {
    this.data = config.data;
  }

  ngOnInit(): void {
    this.layoutService.isMobile$.subscribe(value => {
      this.isMobile = value;
    });
    this.remediationPlanService.getAllRemediationPlanDetailById(this.data.id).subscribe(res => {
      this.listCriterialRepair = res.body;
    });
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
    // this.toastMessageSaveSucess();
    // this.dialogRepairCriterial = false;
    this.ref.close(true);
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
      // this.toastMessageSaveSucess();
      // this.LoadlistCriterialRepairTable(this.remediationPlanSelected.id);
    } catch (error) {
      console.error('Có lỗi xảy ra:', error);
    }
  }
}
