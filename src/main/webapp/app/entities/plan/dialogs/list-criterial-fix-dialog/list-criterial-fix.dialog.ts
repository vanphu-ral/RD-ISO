import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { PlanGroupService } from 'app/entities/plan-group/service/plan-group.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './list-criterial-fix.dialog.html',
  imports: [SharedModule, FormsModule, TableModule, RouterModule],
})
export class ListCriterialFixDialog {
  data: any;
  typeCriterial: number = 0;
  type: string = '';
  listCriterialFix: any[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private planGrHistoryDetailService: PlanGroupService,
  ) {
    this.data = config.data.data;
    this.typeCriterial = config.data.typeCriterial;
    this.type = config.data.type;
  }

  ngOnInit(): void {
    if (this.type == 'PLAN') {
      this.planGrHistoryDetailService.getRecheckDetailPlan(this.data.id, '', '', 0, 10).subscribe(res => {
        if (this.typeCriterial == 0) {
          this.listCriterialFix =
            res.body?.content.filter((item: any) => item.result === 'Đạt' && item.statusRecheck === 'Đã hoàn thành') || [];
        } else {
          this.listCriterialFix =
            res.body?.content.filter((item: any) => item.result != 'Đạt' && item.statusRecheck != 'Đã hoàn thành') || [];
        }
      });
    } else {
      this.planGrHistoryDetailService.getRecheckDetails(this.data.id, '', '', 0, 10).subscribe(res => {
        if (this.typeCriterial == 0) {
          this.listCriterialFix =
            res.body?.content.filter((item: any) => item.result === 'Đạt' && item.statusRecheck === 'Đã hoàn thành') || [];
        } else {
          this.listCriterialFix =
            res.body?.content.filter((item: any) => item.result != 'Đạt' && item.statusRecheck != 'Đã hoàn thành') || [];
        }
      });
    }
  }
}
