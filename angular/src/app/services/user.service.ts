import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";


@Injectable()
export class UserService {

  public user: User|null = null
  public user$ = new BehaviorSubject<User|null>(null);
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient
  ) {
    this.user$.subscribe((data: any) => {
      this.user = data;
      this.isLoggedIn$.next(!!data && 'mobile_number' in data);
    });
    this.http.get('/api/account/me').subscribe((data: any) => {
      if(data) {
        this.user$.next(data);
      }
    }, () => {
      this.user$.next(null);
    });
  }

  public getProfile() {
    this.http.get('/api/account/me').subscribe((data: any) => {
      this.user$.next(data);
    });
  }

  public login(data: {username: string, password: string}) {
    return this.http.post('/api/account/login', data).pipe(
      tap((data: any) => {
        this.user$.next(data);
      }),
      catchError((err) => {
        this.user$.next(null);
        return throwError(err);
      })
    )
  }

  public register(data: {username: string, password: string, confirm_password: string, first_name: string, last_name: string}) {
    return this.http.post('/api/account/register/details', data);
  }

  public logout() {
    return this.http.post('/api/account/logout', {});
  }

  public requestOtp(mobile_number: string) {
    return this.http.post('/api/account/me/verify-otp', {mobile_number});
  }

  public resendOtp() {
    return this.http.post('/api/account/register/resend-otp', {});
  }

  public verify_registration(otp: string) {
    return this.http.post('/api/account/register/verify', {otp}).pipe(
      tap((data: any) => {
        this.user$.next(data);
      })
    );
  }

  public changePassword(data: {new_password: string, current_password: string}) {
    return this.http.post('/api/account/me/change-password', data);
  }

  public saveProfile(data: {first_name: string, last_name: string, email: string, gender: string}) {
    return this.http.post('/api/account/me/save-profile', data).pipe(
      tap((data: any) => {
        this.user$.next(data);
      })
    );
  }

  public addNumber(data: {mobile_number: string}) {
    return this.http.post('/api/account/me/number/request-otp', data);
  }

  public verifyNumber(otp: string) {
    return this.http.post('/api/account/me/number/verify-otp', {otp}).pipe(
      tap((data: any) => {
        if(this.user != null)
          this.user.mobile_numbers.push(data)
        this.user$.next(this.user);
      })
    );
  }

  public resendOtpNumber() {
    return this.http.post('/api/account/me/number/resend-otp', {});
  }
}
