import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReport, NewReport } from '../report.model';

export type PartialUpdateReport = Partial<IReport> & Pick<IReport, 'id'>;

type RestOf<T extends IReport | NewReport> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestReport = RestOf<IReport>;

export type NewRestReport = RestOf<NewReport>;

export type PartialUpdateRestReport = RestOf<PartialUpdateReport>;

export type EntityResponseType = HttpResponse<IReport>;
export type EntityArrayResponseType = HttpResponse<IReport[]>;

@Injectable({ providedIn: 'root' })
export class ReportService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reports');
  protected resourceUrl1 = this.applicationConfigService.getEndpointFor('api/reports/plan');
  protected resourceUrl2 = this.applicationConfigService.getEndpointFor('api/reports/plan/null');

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get<IReport[]>(this.resourceUrl).pipe(map(converts => converts.some(convert => convert.name === name)));
  }
  getAllByPlanId(id: number): Observable<any> {
    return this.http.get<any[]>(`${this.resourceUrl1}/${id}`);
  }
  getAllWherePlanIdIsNull(): Observable<any> {
    return this.http.get<any[]>(this.resourceUrl2);
  }
  create(report: NewReport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(report);
    return this.http
      .post<RestReport>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  saveDetails(details: any[]): Observable<any> {
    return this.http.post<any>(`${this.resourceUrl}/details`, details);
  }

  update(report: IReport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(report);
    return this.http
      .put<RestReport>(`${this.resourceUrl}/${this.getReportIdentifier(report)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(report: PartialUpdateReport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(report);
    return this.http
      .patch<RestReport>(`${this.resourceUrl}/${this.getReportIdentifier(report)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestReport>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestReport[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReportIdentifier(report: Pick<IReport, 'id'>): number {
    return report.id;
  }

  compareReport(o1: Pick<IReport, 'id'> | null, o2: Pick<IReport, 'id'> | null): boolean {
    return o1 && o2 ? this.getReportIdentifier(o1) === this.getReportIdentifier(o2) : o1 === o2;
  }

  addReportToCollectionIfMissing<Type extends Pick<IReport, 'id'>>(
    reportCollection: Type[],
    ...reportsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reports: Type[] = reportsToCheck.filter(isPresent);
    if (reports.length > 0) {
      const reportCollectionIdentifiers = reportCollection.map(reportItem => this.getReportIdentifier(reportItem));
      const reportsToAdd = reports.filter(reportItem => {
        const reportIdentifier = this.getReportIdentifier(reportItem);
        if (reportCollectionIdentifiers.includes(reportIdentifier)) {
          return false;
        }
        reportCollectionIdentifiers.push(reportIdentifier);
        return true;
      });
      return [...reportsToAdd, ...reportCollection];
    }
    return reportCollection;
  }

  getAllStatisticalByReportId(planId: number, reportId: number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl}/statistical/plan/${planId}/report/${reportId}`, { observe: 'response' });
  }

  protected convertDateFromClient<T extends IReport | NewReport | PartialUpdateReport>(report: T): RestOf<T> {
    return {
      ...report,
      createdAt: report.createdAt?.toJSON() ?? null,
      updatedAt: report.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restReport: RestReport): IReport {
    return {
      ...restReport,
      createdAt: restReport.createdAt ? dayjs(restReport.createdAt) : undefined,
      updatedAt: restReport.updatedAt ? dayjs(restReport.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestReport>): HttpResponse<IReport> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestReport[]>): HttpResponse<IReport[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
