import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private _isMobile = new BehaviorSubject<boolean>(false);
  public isMobile$ = this._isMobile.asObservable();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this._isMobile.next(result.matches);
    });
  }

  get isMobile(): boolean {
    return this._isMobile.getValue();
  }
}
