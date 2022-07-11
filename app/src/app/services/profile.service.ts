import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Profile } from '../../../../api/src/types/profile/profile';
import { ProfileReview } from '../../../../api/src/types/profile/profile-review';
import { UserAccess } from '../../../../api/src/types/user-access/user-access';
import { ProfileLinkInfo } from '../../../../api/src/types/user/profile-link-info';
import { RequiredAction } from '../../../../api/src/types/required-action/required-action';
import { User } from '../../../../api/src/types/user/user';
import { PaginatedProfile } from '../../../../api/src/types/profile/paginated-profile';

interface ProfileReviewReturn {
  profile: Profile;
  access: UserAccess;
  action?: RequiredAction;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly API_URL = '/api/profile';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  createUser(name: string, email: string): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/create-user`, { name, email });
  }

  linkAccounts(info: ProfileLinkInfo): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/link-accounts`, info);
  }

  fetchTotalProfileCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/count`);
  }

  public fetchAllPaginated(
    query?: any,
    page: number = 1,
    per_page: number = 10,
    sort: string = 'name,ASC',
  ): Observable<PaginatedProfile> {

    return this.http
      .get<PaginatedProfile>(`${this.API_URL}?s=${JSON.stringify(query || {})}&page=${page}&per_page=${per_page}&sort=${sort}`);

  }

  fetchProfiles(query: string): Observable<PaginatedProfile> {
    return this.http.get<PaginatedProfile>(`${this.API_URL}?${query}`);
  }

  fetchOne(id: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.API_URL}/${id}`);
  }

  updateInfo(id: string, profile: Partial<Profile>): Observable<Profile> {
    return this.http.patch<Profile>(`${this.API_URL}/${id}`, profile);
  }

  reviewProfile(id: string, profileReview: Partial<ProfileReview>): Observable<ProfileReviewReturn> {
    return this.http.patch<ProfileReviewReturn>(`${this.API_URL}/${id}/review`, profileReview);
  }

  searchByNameOrEmail(name: string, limit?: number): Observable<Profile[]> {

    let url = `${this.API_URL}?filter=name||$contL||${name}&or=email||$contL||${name}&sort=name,ASC`;

    if (limit) {
      url = `${url}&limit=${limit}`;
    }

    return this.http.get<Profile[]>(url);
  }
}
