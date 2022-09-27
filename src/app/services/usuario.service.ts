import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interce';

declare const google: any;

const base_url: string = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _ngZone: NgZone
  ) {}

  logout() {
    localStorage.removeItem('token');
    google.accounts.id.revoke('alexggiuliano@gmail.com', () => {
      this._ngZone.run(() => {
        this._router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this._http
      .get(`${base_url}/login/renew`, {
        headers: { 'x-token': token },
      })
      .pipe(
        tap((res: any) => localStorage.setItem('token', res.token)),
        map(() => true),
        catchError(() => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this._http
      .post(`${base_url}/usuarios`, formData)
      .pipe(tap((res: any) => localStorage.setItem('token', res.token)));
  }

  login(formData: LoginForm) {
    return this._http
      .post(`${base_url}/login`, formData)
      .pipe(tap((res: any) => localStorage.setItem('token', res.token)));
  }

  loginGoogle(token: string) {
    return this._http
      .post(`${base_url}/login/google`, { token })
      .pipe(tap((res: any) => localStorage.setItem('token', res.token)));
  }
}
