import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportDTO } from '../summary.model';

@Injectable({ providedIn: 'root' })
export class SummaryService {
  private resourceUrl = 'api/plans';

  constructor(private http: HttpClient) {}

  getSummaryReportDetail(dto: ReportDTO, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    return this.http.post<any>(`${this.resourceUrl}/statistical`, dto, { params });
  }
}
