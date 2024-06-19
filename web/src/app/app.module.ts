import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes }   from '@angular/router';

import { AppComponent } from './app.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './shared/material/material.module';
import { CommonModule } from '@angular/common';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AppRoutingModule } from './app-routing.module';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AppConfigService } from './services/app-config.service';
import { AlertDialogComponent } from './shared/alert-dialog/alert-dialog.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter } from './shared/utility/app-date-adapter';
import { TimeagoClock, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { Observable, interval } from 'rxjs';
import { PusherService } from './services/pusher.service';
import { ImageCropperModule } from 'ngx-image-cropper';
import { WebcamModule } from 'ngx-webcam';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { DragAndDropDirective } from './shared/directive/drag-and-drop.directive';
import { RegisterComponent } from './pages/register/register.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SocialComponent } from './shared/navbar/social/social.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './shared/footer/footer.component';
export class MyClock extends TimeagoClock {
  tick(then: number): Observable<number> {
    return interval(1000);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    AlertDialogComponent,
    DragAndDropDirective,
    NavbarComponent,
    SocialComponent,
    HomeComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    ImageCropperModule,
    WebcamModule,
    FlexModule,
    NgHttpLoaderModule.forRoot(),
    TimeagoModule.forRoot({
      formatter: {provide: TimeagoClock, useClass: MyClock },
    })
  ],
  providers: [
    PusherService,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500} },
    {
      provide : APP_INITIALIZER,
      multi : true,
      deps : [AppConfigService],
      useFactory : (config : AppConfigService) =>  () => config.loadAppConfig()
    },
    {provide: DateAdapter, useClass: AppDateAdapter},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
