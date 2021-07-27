import 'firebase/auth';
import * as firebase from 'firebase/app';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(@Inject(HttpClient) private http: HttpClient) {
    this.http
      .get('/api/auth/firebase-public-config')
      .pipe(take(1))
      .subscribe((config) => {
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }
      });
  }

  public createUserWithEmailAndPassword(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  public signInWithEmailAndPassword(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  public get currentUser() {
    return firebase.auth().currentUser;
  }

  public linkGoogleAccount() {
    return firebase.auth().currentUser.linkWithRedirect({providerId: firebase.auth.GoogleAuthProvider.PROVIDER_ID});
  }

  public sendPasswordResetEmail(email: string) {
    return firebase.auth().sendPasswordResetEmail(email);
  }

}
