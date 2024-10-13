// angular import
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { catchError, finalize, Observable } from 'rxjs';
import { Response } from 'src/app/core/models/generic/Response';
import { AuthResponse, LoginRequest } from 'src/app/core/models/interface/Auth';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzMessageService } from 'ng-zorro-antd/message';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Constants } from 'src/app/core/constants/Constants';
import { JwtService } from 'src/app/core/services/jwt/jwt.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent {
  formLogin: FormGroup
  authResponse: AuthResponse
  isValid: boolean

  constructor(
    private formBuilder: FormBuilder,
    private authSerivce: AuthService,
    private nzMessageService: NzMessageService,
    private jwtService: JwtService,
    private router: Router,
  ) {
    this.formLogin = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: [true]
    })
    this.authResponse = {
      token: ""
    },
    this.isValid = true;
  }

  onTouched(){
    this.formLogin.get("email")?.markAsTouched;
    this.formLogin.get("password")?.markAsTouched;
  }

  checkFieldValidation(fieldName: string): boolean{
    const control = this.formLogin.get(fieldName);
    return control ? control.invalid : false;
  }

  checkEmailValidation(): boolean{
    return this.checkFieldValidation("email") && !this.isValid
  }

  checkPassowrdValidation(): boolean{
    return this.checkFieldValidation("password") && !this.isValid
  }

  loginSubmit() {
    if(this.formLogin.valid){
      let loginRequest: LoginRequest = {
        email: this.formLogin.get("email")?.value,
        password: this.formLogin.get("password")?.value
      }
      const id = this.nzMessageService.loading("Vui lòng chờ", {nzDuration: 0}).messageId
      this.authSerivce.login(loginRequest).pipe(
        finalize(() => {
          this.nzMessageService.remove(id)
        }),
        catchError((errorResponse) => {
          console.log(errorResponse)
          if(errorResponse.status === 400){
            this.nzMessageService.error(Constants.WRONG_EMAIL_PASSWORD)
          }else{
            this.nzMessageService.error(errorResponse.error.message)
          }
          this.formLogin.get("password")?.setValue("")
          this.isValid = true
          return new Observable<AuthResponse>;
        })
      ).subscribe({
        next: (response: AuthResponse) => {
          this.authResponse = response as AuthResponse
          this.jwtService.addToken(this.authResponse.token)
          this.navigator(Constants.ADMIN_HOME_PAGE)
        }
      })
    }else{
      this.isValid = false
    }
  }

  navigator(url: string){
    this.router.navigateByUrl(url)
  }
}
