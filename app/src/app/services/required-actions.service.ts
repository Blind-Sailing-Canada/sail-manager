import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequiredAction } from '../../../../api/src/types/required-action/required-action';
import { RequiredActionStatus } from '../../../../api/src/types/required-action/required-action-status';
@Injectable({
  providedIn: 'root'
})
export class RequiredActionsService {

  private readonly API_URL = '/api/required-action';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public fetchNewRequiredActionsForUser(userId: string): Observable<RequiredAction[]> {
    return this.http
    .get<RequiredAction[]>(
      `${this.API_URL}/my-required-actions`);
  }

  public completeRequiredAction(actionId: string): Observable<RequiredAction> {
    return this.http
      .patch<RequiredAction>(`${this.API_URL}/${actionId}`, {
        status: RequiredActionStatus.Completed,
      });
  }

  public dismissRequiredAction(actionId: string): Observable<RequiredAction> {
    return this.http
      .patch<RequiredAction>(`${this.API_URL}/${actionId}`, {
        status: RequiredActionStatus.Dismissed,
      });
  }
}
