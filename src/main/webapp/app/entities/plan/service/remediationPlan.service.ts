import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import dayjs from 'dayjs/esm';
import { map, Observable } from 'rxjs';
export interface IRemediationPlanGroup {
  id: number;
  code?: string | null;
  name?: string | null;
  reportId?: number | null;
  planId?: number | null;
  repairDate?: dayjs.Dayjs | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  createdBy?: string | null;
  type?: string | null;
  status?: string | null;
}
@Injectable({ providedIn: 'root' })
export class RemediationPlanService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/remediation-plan');
  protected resourceDetailUrl = this.applicationConfigService.getEndpointFor('api/remediation-plan-detail');
  protected resourceRecheckDetailUrl = this.applicationConfigService.getEndpointFor('api/recheck-remediation-plan-detail');

  checkNameExistsByReport(name: string, reportId: number): Observable<boolean> {
    return this.http
      .get<IRemediationPlanGroup[]>(`${this.resourceUrl}/${reportId}`)
      .pipe(map(converts => converts.some(convert => convert.name === name)));
  }

  checkNameExistsByPlan(name: string, planId: number): Observable<boolean> {
    return this.http
      .get<IRemediationPlanGroup[]>(`${this.resourceUrl}/plan-id/${planId}`)
      .pipe(map(converts => converts.some(convert => convert.name === name)));
  }

  getListByReportId(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAllRemediationPlanDetailById(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceDetailUrl}/${id}`, { observe: 'response' });
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(this.resourceUrl, data, { observe: 'response' });
  }

  createRemediationPlanDetail(data: any[]): Observable<any> {
    return this.http.post<any>(this.resourceDetailUrl, data, { observe: 'response' });
  }

  createRecheckRemePlan(data: any[]): Observable<any> {
    return this.http.post<any>(this.resourceRecheckDetailUrl, data, { observe: 'response' });
  }

  getAllRecheckByRemeDetailId(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceRecheckDetailUrl}/${id}`, { observe: 'response' });
  }

  deleteRemePlan(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getListByPlanId(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl}/plan-id/${id}`, { observe: 'response' });
  }

  getListByPlanIdAndReportId(planId: number, reportId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl}/get-all/${planId}/${reportId}`, { observe: 'response' });
  }

  deleteRecheckReme(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceRecheckDetailUrl}/${id}`, { observe: 'response' });
  }

  getRemediationPlanDetailsByReportId(reportId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceDetailUrl}/by-report/${reportId}`, { observe: 'response' });
  }

  getRecheckByReportId(reportId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceRecheckDetailUrl}/by-report/${reportId}`, { observe: 'response' });
  }

  getRemediationPlanWithFullDetails(id: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl}/remediation-plans/${id}/details`, { observe: 'response' });
  }
}
