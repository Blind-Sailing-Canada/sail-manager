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

  public joinChallenge(challengeId: string): Observable<Challenge> {
    return this.http.post<Challenge>(`${this.API_URL}/${challengeId}/join`, null);
  }

  public leaveChallenge(challengeId: string): Observable<Challenge> {
    return this.http.delete<Challenge>(`${this.API_URL}/${challengeId}/leave`);
  }

  public fetchChallenges(query: string): Observable<Challenge[]> {
    if (query) {
      return this.http.get<Challenge[]>(`${this.API_URL}?${query}`);
    }
    return this.http.get<Challenge[]>(`${this.API_URL}`);
  }

  public postChallengeComment(challengeId: string, comment: Partial<Comment>): Observable<Challenge> {
    return this.http.post<Challenge>(`${this.API_URL}/${challengeId}/comments`, comment);
  }

  public deleteChallengeComment(challengeId: string, commentId: string): Observable<Challenge> {
    return this.http.delete<Challenge>(`${this.API_URL}/${challengeId}/comments/${commentId}`);
  }

  public deleteChallengePicture(challengeId: string, pictureId: string): Observable<Challenge> {
    return this.http.delete<Challenge>(`${this.API_URL}/${challengeId}/pictures/${pictureId}`);
  }

  public postChallengePictures(challengeId: string, pictures: Partial<Media>[]): Observable<Challenge> {
    return this.http.patch<Challenge>(`${this.API_URL}/${challengeId}/pictures`, pictures);
  }

  public fetchChallenge(challengeId: string): Observable<Challenge> {
    return this.http.get<Challenge>(`${this.API_URL}/${challengeId}`);
  }

  public createChallenge(challenge: Partial<Challenge>): Observable<Challenge> {
    return this.http.post<Challenge>(`${this.API_URL}`, challenge);
  }

  public updateChallenge(challengeId: string, challenge: Partial<Challenge>): Observable<Challenge> {
    return this.http.patch<Challenge>(`${this.API_URL}/${challengeId}`, challenge);
  }

  public completeUserChallenge(challengeId: string, profile_id: string, note?: string): Observable<Challenge> {
    return this.http.patch<Challenge>(`${this.API_URL}/${challengeId}/accomplished-by/${profile_id}`, { note });
  }

  public fetchCount(query?: string): Observable<number> {
    if (query) {
      return this.http.get<number>(`${this.API_URL}/count?${query}`);
    }
    return this.http.get<number>(`${this.API_URL}/count`);
  }

}
