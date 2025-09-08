import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable, map } from 'rxjs';
import dayjs from 'dayjs/esm';
import { createRequestOption } from 'app/core/request/request-util';
export interface IGrossScript {
  id: number;
  code?: string | null;
  name?: string | null;
  planId?: number | null;
  checker?: string | null;
  checkDate?: dayjs.Dayjs | null;
  type?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  createdBy?: string | null;
  status?: string | null;
}
export type EntityResponseType = HttpResponse<any>;
export type EntityArrayResponseType = HttpResponse<any[]>;

@Injectable({ providedIn: 'root' })
export class PlanGroupService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);
  protected resourceUrl = this.applicationConfigService.getEndpointFor('/api/plan-group-history');
  protected resourceDetailUrl = this.applicationConfigService.getEndpointFor('/api/plan-group-history-detail');

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<any[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: HttpResponse<any[]>) => this.convertResponseArrayFromServer(res)));
  }

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get<IGrossScript[]>(this.resourceUrl).pipe(map(converts => converts.some(convert => convert.name === name)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<any>(`${this.resourceUrl}/${id}`, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }
  getAllByPlanId(planId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<any[]>(`${this.resourceUrl}/with-plan/${planId}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  findAll(): Observable<any> {
    return this.http.get<any>(this.resourceUrl);
  }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.resourceUrl}/with-plan`);
  }

  findAllDetail(id: number): Observable<EntityResponseType> {
    return this.http.get<any>(`${this.resourceDetailUrl}/${id}`, { observe: 'response' });
  }

  findAllDetailByReportId(reportId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<any[]>(`${this.resourceDetailUrl}/by-report-id/${reportId}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  findAllPlanGrByReportId(reportId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<any[]>(`${this.resourceUrl}/by-report-id/${reportId}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  findById(planGrId: number): Observable<EntityResponseType> {
    return this.http
      .get<any>(`${this.resourceUrl}/detail/${planGrId}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  findAllDetailByHistoryAndReportId(historyId: number, reportId: number): Observable<EntityArrayResponseType> {
    const params = createRequestOption({ historyId, reportId });
    return this.http
      .get<any[]>(`${this.resourceDetailUrl}/by-history-and-report`, { params: params, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  protected convertResponseArrayFromServer(res: HttpResponse<any[]>): HttpResponse<any[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  protected convertDateFromServer(restPlanGroup: any): any {
    return {
      ...restPlanGroup,
      createdAt: restPlanGroup.createdAt ? dayjs(restPlanGroup.createdAt) : undefined,
      updatedAt: restPlanGroup.updatedAt ? dayjs(restPlanGroup.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<any>): HttpResponse<any> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
