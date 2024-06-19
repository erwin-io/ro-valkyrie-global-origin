import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ResolveEnd, ActivatedRouteSnapshot, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RouterEvent } from '@angular/router';
import { Spinkit, SpinnerVisibilityService } from 'ng-http-loader';
import { filter } from 'rxjs';
import { RouteService } from './services/route.service';
import { AppConfigService } from './services/app-config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PusherService } from './services/pusher.service';
import { GeoLocationService } from './services/geo-location.service';
import { Users } from './model/users';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    class: "app-layout"
  }
})
export class AppComponent {
  public spinkit = Spinkit;
  title;
  _toolBarClass;
  _hideAuth: boolean;
  grantNotif = false;
  profile: Users;
  constructor(
    private titleService:Title,
    private spinner: SpinnerVisibilityService,
    private router: Router,
    private snackBar:MatSnackBar,
    private appconfig: AppConfigService,
    private geoLocationService: GeoLocationService,
    private routeService: RouteService,
    private pusher: PusherService)  {
      this.titleService.setTitle(`${this.appconfig.config.appName}`);
  }
  ngOnInit(): void {
  }
  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.spinner.show();
    }
    if (event instanceof NavigationEnd) {
      this.spinner.hide();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.spinner.hide();
    }
    if (event instanceof NavigationError) {
      this.spinner.hide();
    }
  }

  get toolBarClass() {
    return this._toolBarClass;
  }

  get hideAuth() {
    return this._hideAuth;
  }

  onActivate(event) {
  }
}
