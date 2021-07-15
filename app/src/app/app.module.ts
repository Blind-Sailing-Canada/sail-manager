import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
} from '@angular/common/http';
import {
  ErrorHandler,
  Injectable,
  // ErrorHandler,
  // Injectable,
  InjectionToken,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import {
  ActionReducerMap,
  StoreModule,
} from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as Sentry from '@sentry/browser';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/http.interceptor';
import { FooterModule } from './components/footer/footer.module';
import { HeaderModule } from './components/header/header.module';
import { BasePageModule } from './pages/base-page/base-page.module';
import { effects } from './store/effects/effects';
import { store } from './store/store';

export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<any>>(
  'Registered Reducers',
  {
    factory: () => {
      return store;
    }
  }
);

try {
  Sentry.init({
    // THIS IS REPLCED WITH ACTUAL VALUE BY start-servers.sh
    dsn: 'SENTRY_DSN',
  });

  Sentry.captureEvent({ level: Sentry.Severity.Info, message: 'Sentry initialized in app.module.ts' });
} catch (error) {
  console.error(error);
}

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() { }
  handleError(error) {
    console.error(error.originalError || error);

    if (error.message.startsWith('ExpressionChangedAfterItHasBeenCheckedError')) {
      return;
    }

    if (error.originalError && error.originalError.message.startsWith('ExpressionChangedAfterItHasBeenCheckedError')) {
      return;
    }

    Sentry.captureException(error.originalError || error);
  }
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    BasePageModule,
    BrowserAnimationsModule,
    BrowserModule,
    EffectsModule.forRoot(effects),
    FooterModule,
    HeaderModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot(REDUCER_TOKEN),
    StoreDevtoolsModule.instrument({ maxAge: 500 }), // KEEP THIS LAST
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
