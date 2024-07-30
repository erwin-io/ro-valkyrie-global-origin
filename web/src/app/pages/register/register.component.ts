import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, ValidationErrors, FormGroup, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
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
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatStepper } from '@angular/material/stepper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  host: {
    class: "page-component"
  }
})
export class RegisterComponent {
  // registerForm: FormGroup;
  accountForm: FormGroup;
  passwordForm: FormGroup;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  loading = false;
  error: string;
  isProcessing = false;
  completed = false;
  userCheckList = [];
  stepperOrientation: 'horizontal' | 'vertical'
  @ViewChild("stepper", { static: false }) stepper: MatStepper;
  constructor(
    private formBuilder: FormBuilder,
    private appconfig: AppConfigService,
    private authService: AuthService,
    private spinner: SpinnerVisibilityService,
    private snackBar: MatSnackBar,
    private routeService: RouteService,
    private dialog: MatDialog,
    private titleService: Title,
    private breakpointObserver: BreakpointObserver,
    private router: Router) {
      this.titleService.setTitle(`Register — ${this.appconfig.config.appName}`);
      // detect screen size changes
      this.breakpointObserver.observe([
        "(max-width: 1000px)"
      ]).subscribe((result: BreakpointState) => {
        if (result.matches) {
            // hide stuff     
            this.stepperOrientation = 'vertical';
        } else {
            // show stuff
            this.stepperOrientation = 'horizontal';
        }
      });
    }


  ngOnInit() {
    // this.registerForm = this.formBuilder.group({
    //   accountNumber: [null, [Validators.required, Validators.minLength(2)]],
    //   password: [null, [Validators.required,Validators.minLength(8),Validators.maxLength(16)]],
    //   confirmPassword: [null, [Validators.required]],
    // },
    // { validators: this.customFormValidators });

    this.accountForm = this.formBuilder.group({
      accountNumber: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
    });

    this.passwordForm = this.formBuilder.group({
      password: [null, [Validators.required,Validators.minLength(6),Validators.maxLength(30)]],
      confirmPassword: [null, [Validators.required]],
    },
    { validators: this.customFormValidators });

  }

  get formValue() {
    return {
      ...this.accountForm.value,
      ...this.passwordForm.value,
    }
  }

  get formControls() {
    return {
      ...this.accountForm.controls,
      ...this.passwordForm.controls,
    }
  }

  get formValid() {
    return this.accountForm.valid && this.passwordForm.valid
  }

  get formDirty() {
    return this.accountForm.dirty || this.passwordForm.dirty
  }

  get formPristine() {
    return this.accountForm.pristine && this.passwordForm.pristine
  }

  get formTouched() {
    return this.accountForm.touched || this.passwordForm.touched
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
    if(this.formControls[key]?.touched && ( this.formControls[key]?.dirty || this.formControls[key]?.invalid || !this.formControls[key]?.valid)) {
      console.log(this.formControls[key].errors);
      return this.formControls[key].errors;
    }
    else {
      return null;
    }
  }

  onCheckAccount() {
    if (!this.accountForm.valid) {
        return;
    }
    const { accountNumber } = this.accountForm.value;
    console.log(accountNumber);
    try{
      this.isProcessing = true;
      this.spinner.show();
      this.authService.checkAccount(accountNumber).pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(this.handleError('register', []))
      ).subscribe(async (res: ApiResponse<Users>)=> {
        console.log(res);
        if(res.data) {
          this.stepper.next();
          this.accountForm.controls["accountNumber"].setErrors(null)
        } else {
          this.error = "The account has been used!";
          this.accountForm.controls["accountNumber"].setErrors({
            exist: true,
          })
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        }
        this.isProcessing = false;
        this.spinner.hide();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
      }, async (e)=> {
        this.spinner.hide();
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isProcessing = false;
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
      this.isProcessing = false;
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
  }

  onSubmit() {
    if (!this.formValid) {
        return;
    }
    const formData = {
      account: this.formValue.accountNumber,
      password: this.formValue.password
    };
    console.log(formData);
    try{
      this.isProcessing = true;
      this.spinner.show();
      const dialogData = new AlertDialogModel();
      this.authService.register(formData).pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(this.handleError('register', []))
      ).subscribe(async (res: ApiResponse<Users>)=> {
        console.log(res);
        if(res.message === "success") {
          this.completed = true;
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
            // this.router.navigate(['/']);
          });
        } else {
          this.completed = false;
          this.error = res.message.toString();
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        }
        this.isProcessing = false;
        this.spinner.hide();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
      }, async (e)=> {
        this.completed = false;
        this.spinner.hide();
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isProcessing = false;
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
      this.isProcessing = false;
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
