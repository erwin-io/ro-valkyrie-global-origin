import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Validators, FormBuilder, ValidationErrors, FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Subject, takeUntil, catchError, Observable, of } from 'rxjs';
import { ApiResponse } from 'src/app/model/api-response.model';
import { Users } from 'src/app/model/users';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';
import { RouteService } from 'src/app/services/route.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  host: {
    class: "page-component"
  }
})
export class RegisterComponent {
  registerForm: FormGroup;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  loading = false;
  isSubmitting = false;
  error: string;
  isProcessing = false;
  userCheckList = [];
  constructor(
    private formBuilder: FormBuilder,
    private appconfig: AppConfigService,
    private authService: AuthService,
    private spinner: SpinnerVisibilityService,
    private snackBar: MatSnackBar,
    private routeService: RouteService,
    private dialog: MatDialog,
    private titleService: Title,
    private router: Router) {
      this.titleService.setTitle(`Register — ${this.appconfig.config.appName}`);
    }


  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      userName: [null, [Validators.required, Validators.minLength(2)]],
      password: [null, [Validators.required,Validators.minLength(8),Validators.maxLength(16)]],
      confirmPassword: [null, [Validators.required]],
    },
    { validators: this.customFormValidators });

  }

  customFormValidators: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    if(group.get('confirmPassword').dirty && group.get('confirmPassword')?.dirty && group.get('password')?.value !== group.get('confirmPassword')?.value) {
      group.get('confirmPassword')?.setErrors({ notSame: true });
    } else if(group.get('confirmPassword').value && group.get('confirmPassword').value.length === 0) {
      group.get('confirmPassword')?.setErrors({ required: true });
    }
    return null;
  };


  getError(key): ValidationErrors {
    if(this.registerForm.controls[key]?.touched && ( this.registerForm.controls[key]?.dirty || this.registerForm.controls[key]?.invalid || !this.registerForm.controls[key]?.valid)) {
      return this.registerForm.controls[key].errors;
    }
    else {
      return null;
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
        return;
    }
    try{
      this.spinner.show();
      const dialogData = new AlertDialogModel();
      console.log(this.registerForm.value);
      const formData = this.registerForm.value;
      this.authService.register(formData).pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(this.handleError('login', []))
      ).subscribe(async (res: ApiResponse<Users>)=> {
        console.log(res);
        if(res.success) {
          dialogData.title = 'Successfully registerd!';
          dialogData.dismissButton = {
            visible: true,
            text: 'Ok',
          };
          dialogData.confirmButton.visible = false;
          const dialogRef = await this.dialog.open(AlertDialogComponent, {
            maxWidth: '400px',
            closeOnNavigation: false,
          });
          dialogRef.componentInstance.alertDialogConfig = dialogData;
          dialogRef.afterClosed().subscribe(res=> {
            dialogRef.close();
            this.router.navigate(['/auth/login/driver']);
          });
        } else {
          this.error = res.message.toString();
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        }
        this.isSubmitting = false;
        this.spinner.hide();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
      }, async (e)=> {
        this.spinner.hide();
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isSubmitting = false;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        console.log(e);
      }, async ()=> {
        this.spinner.hide();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
      });
    } catch (e){
      this.spinner.hide();
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
      this.isSubmitting = false;
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
  }

  handleError<T>(operation = 'operation', result?: any) {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    return (error: any): Observable<any> => {
      return of(error.error as any);
    };
  }

}
