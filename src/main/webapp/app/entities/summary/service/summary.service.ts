import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportDTO } from '../summary.model';
import dayjs from 'dayjs/esm';

@Injectable({ providedIn: 'root' })
export class SummaryService {
  private resourceUrl = 'api/plans';

  constructor(private http: HttpClient) {}

  getSummaryReportDetail(dto: ReportDTO, page: number = 0, size: number = 10): Observable<any> {
    const payload = {
      ...dto,
      timeStart: dto.timeStart ? dayjs(dto.timeStart).format('YYYY-MM-DD') : undefined,
      timeEnd: dto.timeEnd ? dayjs(dto.timeEnd).format('YYYY-MM-DD') : undefined,
    };
    let params = new HttpParams().set('page', page).set('size', size);
    return this.http.post<any>(`${this.resourceUrl}/statistical`, payload, { params });
  }

  getSummaryReport(dto: ReportDTO, page: number = 0, size: number = 10): Observable<any> {
    const payload = {
      ...dto,
      timeStart: dto.timeStart ? dayjs(dto.timeStart).format('YYYY-MM-DD') : undefined,
      timeEnd: dto.timeEnd ? dayjs(dto.timeEnd).format('YYYY-MM-DD') : undefined,
    };
    let params = new HttpParams().set('page', page).set('size', size);
    return this.http.post<any>(`${this.resourceUrl}/statistical/by-subject-assetment-plan`, payload, { params });
  }

  getSummaryDetail(dto: ReportDTO, page: number = 0, size: number = 10): Observable<any> {
    const payload = {
      ...dto,
      timeStart: dto.timeStart ? dayjs(dto.timeStart).format('YYYY-MM-DD') : undefined,
      timeEnd: dto.timeEnd ? dayjs(dto.timeEnd).format('YYYY-MM-DD') : undefined,
    };
    let params = new HttpParams().set('page', page).set('size', size);
    return this.http.post<any>(`${this.resourceUrl}/statistical/by-group`, payload, { params });
  }
}
