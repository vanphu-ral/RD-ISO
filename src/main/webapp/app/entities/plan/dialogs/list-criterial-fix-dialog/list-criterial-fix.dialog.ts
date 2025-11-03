import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { PlanGroupService } from 'app/entities/plan-group/service/plan-group.service';

@Component({
  standalone: true,
  templateUrl: './list-criterial-fix.dialog.html',
  imports: [SharedModule, FormsModule, TableModule],
})
export class ListCriterialFixDialog {
  data: any;
  type: number = 0;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private planGrHistoryDetailService: PlanGroupService,
  ) {
    this.data = config.data.data;
    this.type = config.data.type;
  }

  ngOnInit(): void {
    this.planGrHistoryDetailService.getRecheckDetails(this.data.id, '', '', 0, 10).subscribe(res => {
      console.log(res);
    });
  }
}
