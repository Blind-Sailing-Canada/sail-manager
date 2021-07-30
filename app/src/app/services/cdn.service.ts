import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CDNService {

  constructor(
    @Inject(HttpClient) private httpClient: HttpClient,
  ) { }

  public getFiles(path: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`cdn/list?directory=${path}`);
  }

  public uploadMaintenancePicture(fileToUpload: File): Observable<HttpEvent<string>> {
    const endpoint = `images/maintenance/${fileToUpload.name}`;
    return this.uploadFile(endpoint, fileToUpload);
  }

  public uploadBoatPicture(fileToUpload: File, boat_id: string): Observable<HttpEvent<string>> {
    const endpoint = `images/boats/${boat_id}/${fileToUpload.name}`;
    return this.uploadFile(endpoint, fileToUpload);
  }

  public uploadDepartureInstructionsPicture(fileToUpload: File, boat_id: string): Observable<HttpEvent<string>> {
    const endpoint = `images/boats/${boat_id}/departure/${fileToUpload.name}`;
    return this.uploadFile(endpoint, fileToUpload);
  }

  public uploadArrivalInstructionsPicture(fileToUpload: File, boat_id: string): Observable<HttpEvent<string>> {
    const endpoint = `images/boats/${boat_id}/arrival/${fileToUpload.name}`;
    return this.uploadFile(endpoint, fileToUpload);
  }

  public uploadProfilePicture(fileToUpload: File, profile_id: string): Observable<HttpEvent<string>> {
    const lastDotIndex = fileToUpload.name.lastIndexOf('.');
    const ext = fileToUpload.name.substring(lastDotIndex + 1);
    const endpoint = `images/profiles/${profile_id}.${ext}`;
    return this.uploadFile(endpoint, fileToUpload);
  }

  public uploadSailPicture(fileToUpload: File, sail_id: string): Observable<HttpEvent<string>> {
    const endpoint = `images/sails/${sail_id}/${fileToUpload.name}`;
    return this.uploadFile(endpoint, fileToUpload);
  }

  public uploadChallengePicture(fileToUpload: File, challengeId: string): Observable<HttpEvent<string>> {
    const endpoint = `images/challenges/${challengeId}/${fileToUpload.name}`;
    return this.uploadFile(endpoint, fileToUpload);
  }

  public uploadBoatMaintenancePicture(fileToUpload: File, maintenanceId: string): Observable<HttpEvent<string>> {
    const endpoint = `images/boat-maintenance/${maintenanceId}/${fileToUpload.name}`;
    return this.uploadFile(endpoint, fileToUpload);
  }

  public uploadFile(destination: string, fileToUpload: File): Observable<HttpEvent<string>> {
    const endpoint = `cdn/upload/${destination}`;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    return this.httpClient
      .post(
        endpoint,
        formData,
        { responseType: 'text', reportProgress: true, observe: 'events' })
      .pipe(
        map((event) => {
          if (event.type === HttpEventType.Response) {
            return event.clone({ body: `cdn/files/${event.body}` });
          }
          return event;
        })
      );
  }

  public deleteFile(path: string): Observable<string> {
    return this.httpClient.delete(path, { responseType: 'text' });
  }
}
