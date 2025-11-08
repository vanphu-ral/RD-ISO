import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import SharedModule from 'app/shared/shared.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { PlanGroupService } from 'app/entities/plan-group/service/plan-group.service';
import { ButtonModule } from 'primeng/button';
import { RemediationPlanService } from '../../service/remediationPlan.service';
import { EvaluatorService } from 'app/entities/evaluator/service/evaluator.service';
import { LayoutService } from 'app/layouts/service/layout.service';
import dayjs from 'dayjs/esm';
import { AccountService } from 'app/core/auth/account.service';
import { CheckTargetService } from 'app/entities/check-target/service/check-target.service';

@Component({
  standalone: true,
  templateUrl: './create-plan-fix.dialog.html',
  imports: [SharedModule, FormsModule, TableModule, ButtonModule],
})
export class CreatePlanFixDialog {
  data: any;
  groupCriterialError: any = {};
  isNameDuplicate: boolean = false;
  listCriterialError: any[] = [];
  evaluator: any[] = [];
  isMobile: boolean = false;
  selectedlistCriterialError: any[] = [];
  account: any = {};
  listUserHander: any[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private remediationPlanService: RemediationPlanService,
    private evaluatorService: EvaluatorService,
    private layoutService: LayoutService,
    private planGrHistoryDetailService: PlanGroupService,
    private accountService: AccountService,
    private checkTargetService: CheckTargetService,
  ) {
    this.data = config.data;
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
    this.layoutService.isMobile$.subscribe(value => {
      this.isMobile = value;
    });
    this.evaluatorService.getAllCheckTargets().subscribe(res1 => {
      this.checkTargetService.getAllCheckTargets().subscribe(res2 => {
        this.evaluator = [...res1, ...res2];
        this.listUserHander = res2;
      });
    });
    this.planGrHistoryDetailService.getRecheckDetails(this.data.id, '', '', 0, 10).subscribe(res => {
      this.listCriterialError =
        res.body?.content.filter((item: any) => item.result != 'Đạt' && item.statusRecheck != 'Đã hoàn thành') || [];
    });
    this.groupCriterialError.repairDate = new Date().toISOString().substring(0, 10);
    this.groupCriterialError.name = `KHKP-${this.account.login}-${new Date().getDate()}-${
      new Date().getMonth() + 1
    }-${new Date().getFullYear()}-${new Date().getHours()}h${new Date().getMinutes()}p`;
  }

  duplicateNameValidator(name: string | null): void {
    if (!name) {
      this.isNameDuplicate = false;
      return;
    }
    this.remediationPlanService.checkNameExistsByReport(name, this.data.id).subscribe({
      next: isDuplicate => {
        this.isNameDuplicate = isDuplicate;
      },
      error: () => {
        this.isNameDuplicate = false;
      },
    });
  }

  onCreatedByChange(newCreatedBy: string) {
    this.groupCriterialError.createdBy = newCreatedBy;
    for (let row of this.listCriterialError) {
      if (!row.userHandle || row.userHandle.trim() === '') {
        row.userHandle = newCreatedBy;
      }
    }
  }

  generateCode(): string {
    const uid = window.crypto?.randomUUID?.() || this.fallbackUUID();
    return `RP-${this.data.id}-${uid}`;
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
    data.reportId = this.data.id;
    data.planId = this.data.planId;
    data.repairDate = dayjs(data.repairDate).toISOString();
    data.createdAt = dayjs();
    data.type = 'Single';
    data.status = 'Đang xử lý';
    this.remediationPlanService.create(data).subscribe(res => {
      const arrCriterialErr = this.selectedlistCriterialError.map((item: any) => {
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
        this.ref.close(true);
      });
    });
  }
}
