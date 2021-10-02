import 'firebase/compat/auth';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  linkWithRedirect,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firebaseApp: FirebaseApp;

  constructor(@Inject(HttpClient) private http: HttpClient) {
    this.http
      .get('/api/auth/firebase-public-config')
      .pipe(take(1))
      .subscribe((config) => {
        if (!this.firebaseApp) {
          this.firebaseApp = initializeApp(config);
        }
      });
  }

  private get auth() {
    return getAuth(this.firebaseApp);
  }

  public createUserWithEmailAndPassword(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  public signInWithEmailAndPassword(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  public get currentUser() {
    const auth = getAuth();
    return auth.currentUser;
  }

  public linkGoogleAccount() {
    return linkWithRedirect(this.auth.currentUser, new GoogleAuthProvider())
      .then((response) => {
        console.log('link with redirect response', response);
      });
  }

  public sendPasswordResetEmail(email: string) {

    return sendPasswordResetEmail(this.auth, email);
  }

  public logout() {
    signOut(this.auth).catch(error => console.error(error));
  }

}
