import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ICheckTarget } from '../check-target.model';
import { CheckLevelService } from 'app/entities/check-level/service/check-level.service';

@Component({
  standalone: true,
  selector: 'jhi-check-target-detail',
  templateUrl: './check-target-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CheckTargetDetailComponent implements OnInit {
  @Input() checkTarget: ICheckTarget | null = null;
  protected checkLevelService = inject(CheckLevelService);
  ngOnInit(): void {}
  previousState(): void {
    window.history.back();
  }
}
