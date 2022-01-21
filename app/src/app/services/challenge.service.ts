import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Comment } from '../../../../api/src/types/comment/comment';
import { Media } from '../../../../api/src/types/media/media';
import { Challenge } from '../../../../api/src/types/challenge/challenge';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  private readonly API_URL = '/api/challenge';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public joinChallenge(challenge_id: string): Observable<Challenge> {
    return this.http.post<Challenge>(`${this.API_URL}/${challenge_id}/join`, null);
  }

  public leaveChallenge(challenge_id: string): Observable<Challenge> {
    return this.http.delete<Challenge>(`${this.API_URL}/${challenge_id}/leave`);
  }

  public fetchChallenges(query: string): Observable<Challenge[]> {
    if (query) {
      return this.http.get<Challenge[]>(`${this.API_URL}?${query}`);
    }
    return this.http.get<Challenge[]>(`${this.API_URL}`);
  }

  public postChallengeComment(challenge_id: string, comment: Partial<Comment>): Observable<Challenge> {
    return this.http.post<Challenge>(`${this.API_URL}/${challenge_id}/comments`, comment);
  }

  public deleteChallengeComment(challenge_id: string, comment_id: string): Observable<Challenge> {
    return this.http.delete<Challenge>(`${this.API_URL}/${challenge_id}/comments/${comment_id}`);
  }

  public deleteChallengePicture(challenge_id: string, picture_id: string): Observable<Challenge> {
    return this.http.delete<Challenge>(`${this.API_URL}/${challenge_id}/pictures/${picture_id}`);
  }

  public postChallengePictures(challenge_id: string, pictures: Partial<Media>[]): Observable<Challenge> {
    return this.http.patch<Challenge>(`${this.API_URL}/${challenge_id}/pictures`, pictures);
  }

  public fetchChallenge(challenge_id: string): Observable<Challenge> {
    return this.http.get<Challenge>(`${this.API_URL}/${challenge_id}`);
  }

  public createChallenge(challenge: Partial<Challenge>): Observable<Challenge> {
    return this.http.post<Challenge>(`${this.API_URL}`, challenge);
  }

  public updateChallenge(challenge_id: string, challenge: Partial<Challenge>): Observable<Challenge> {
    return this.http.patch<Challenge>(`${this.API_URL}/${challenge_id}`, challenge);
  }

  public completeUserChallenge(challenge_id: string, profile_id: string, note?: string): Observable<Challenge> {
    return this.http.patch<Challenge>(`${this.API_URL}/${challenge_id}/accomplished-by/${profile_id}`, { note });
  }

  public fetchCount(query?: string): Observable<number> {
    if (query) {
      return this.http.get<number>(`${this.API_URL}/count?${query}`);
    }
    return this.http.get<number>(`${this.API_URL}/count`);
  }

}
