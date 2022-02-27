import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";


@Injectable()
export class UserService {

  private user: User|null = null
  public user$ = new BehaviorSubject<User|null>(null);
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public favorites$ = new BehaviorSubject<Lodging[]>([]);
  private favorites: Lodging[] = [];

  constructor(
    private http: HttpClient
  ) {
    this.user$.subscribe((data: any) => {
      this.user = data;
      this.isLoggedIn$.next(!!data && 'mobile_number' in data);
    });
    this.http.get('/api/account/me').subscribe(this.emitUser, (err) => {
      this.user$.next(null);
    });
  }

  emitUser = (data: any) => {
    if(data) {
      data.user_type = this.getUserType(data.user_type);
      this.user$.next(data);
    }
  }

  private getUserType(user_type: string) {
    switch(user_type) {
      case '0': return 'tenant';
      case '1': return 'owner';
      case '2': return 'admin';
    }
    return user_type;
  }

  public getProfile() {
    this.http.get('/api/account/me').subscribe(this.emitUser);
  }

  public login(data: {username: string, password: string}) {
    return this.http.post('/api/account/login', data).pipe(
      tap(this.emitUser),
      catchError((err) => {
        this.user$.next(null);
        return throwError(err);
      })
    )
  }

  public adminLogin(data: {username: string}) {
    return this.http.post('/api/account/login/admin', data).pipe(
      tap(this.emitUser),
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

  public resetPasswordRequestOtp(mobile_number: string) {
    return this.http.post('/api/account/password-reset/request', { mobile_number });
  }

  public resetPasswordVerifyOtpAndSetPassword(data: {otp: string, password: string}) {
    return this.http.post('/api/account/password-reset/verify', data);
  }

  public resendOtp() {
    return this.http.post('/api/account/register/resend-otp', {});
  }

  public verify_registration(otp: string) {
    return this.http.post('/api/account/register/verify', {otp}).pipe(
      tap(this.emitUser)
    );
  }

  public changePassword(data: {new_password: string, current_password: string}) {
    return this.http.post('/api/account/me/change-password', data);
  }

  public resetPassword(data: {new_password: string, otp: string}) {
    return this.http.post('/api/account/me/reset-password', data);
  }

  public saveProfile(data: {first_name: string, last_name: string, email: string, gender: string}) {
    return this.http.post('/api/account/me/save-profile', data).pipe(
      tap(this.emitUser)
    );
  }

  public addNumber(data: {mobile_number: string}) {
    return this.http.post('/api/account/me/number/request-otp', data);
  }

  public verifyNumber(otp: string) {
    return this.http.post('/api/account/me/number/verify-otp', {otp}).pipe(
      tap((data: any) => {
        if(this.user != null)
          this.user.mobile_numbers.push(data);
        this.emitUser(this.user);
      })
    );
  }

  public resendOtpNumber() {
    return this.http.post('/api/account/me/number/resend-otp', {});
  }

  public uploadProfileImage(data: any) {
    return this.http.post('/api/account/me/profile-image', data).pipe(
      tap((data: any) => {
        if(this.user != null)
          this.user.image = data;
      })
    );
  }

  public deleteNumber(number: MobileNumber) {
    return this.http.delete(`/api/account/me/number/${number.id}`).pipe(
      tap(() => {
        if(this.user != null) {
          this.user.mobile_numbers = this.user.mobile_numbers.filter((num: MobileNumber) => num.id != number.id);
          this.emitUser(this.user);
        }
      })
    );
  }

  public removeProfileImage() {
    return this.http.delete('/api/account/me/profile-image').pipe(
      tap(() => {
        if(this.user != null)
          this.user.image = undefined;
        this.emitUser(this.user);
      })
    );
  }

  public loadMyLodgings() {
    return this.http.get('/api/lodging/my/lodgings');
  }

  public loadMyFavorites() {
    return this.http.get('/api/lodging/my/favorites').pipe(tap((f: any) => {
      this.favorites = f;
      this.favorites$.next(this.favorites);
    }));
  }

  public loadMyBookings() {
    return this.http.get('/api/lodging/my/bookings');
  }

  public toggleFavorite(lodgingId: number) {
    let url = `/api/lodging/${lodgingId}/`;
    if((this.user || {favorites: [-1]}).favorites.indexOf(lodgingId) > -1) {
      return this.http.post(url+'remove_from_favorites', {}).pipe(tap(() => {
        this.user!.favorites = this.user!.favorites.filter((p: any) => p != lodgingId);
        this.favorites = this.favorites.filter((f: Lodging) => f.id != lodgingId);
        this.favorites$.next(this.favorites);
        this.emitUser(this.user);
      }));
    } else {
      return this.http.post(url+'add_to_favorites', {}).pipe(tap(() => {
        this.user!.favorites.push(lodgingId);
        this.emitUser(this.user);
      }));
    }
  }

  public disableLodging(lodgingId: any) {
    return this.http.post(`/api/lodging/${lodgingId}/disable`, {});
  }

  public enableLodging(lodgingId: any) {
    return this.http.post(`/api/lodging/${lodgingId}/enable`, {});
  }

  public duplicateLodging(lodgingId: any): Observable<any> {
    return this.http.post(`/api/lodging/${lodgingId}/duplicate`, {});
  }

  public loadAgreement(agreementId:  number) {
    const url = `/api/account/agreements/${agreementId}`;
    return this.http.get(url);
  }

  public saveAgreement(agreementId:  number, data: any) {
    const url = `/api/account/agreements/${agreementId}`;
    return this.http.put(url, data);
  }

  public cŗeateAgreement(data: any) {
    const url = `/api/account/agreements`;
    return this.http.post(url, data);
  }

  public loadAgreements() {
    const url = `/api/account/agreements`;
    return this.http.get(url);
  }

  public deleteAgreement(agreementId: number) {
    const url = `/api/account/agreements/${agreementId}`;
    return this.http.delete(url);
  }

  public loadAddress(addressId:  number) {
    const url = `/api/account/address/${addressId}`;
    return this.http.get(url);
  }

  public saveAddress(addressId: number, data: any) {
    const url = `/api/account/address/${addressId}`;
    return this.http.put(url, data);
  }

  public createAddress(data: any) {
    const url = `/api/account/addresses`;
    return this.http.post(url, data);
  }

  public loadAddresses() {
    const url = `/api/account/addresses`;
    return this.http.get(url);
  }

  public deleteAddress(addressId: number) {
    const url = `/api/account/address/${addressId}`;
    return this.http.delete(url);
  }
}
