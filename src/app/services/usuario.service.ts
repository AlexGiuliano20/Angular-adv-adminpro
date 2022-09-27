import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interce';
import { Usuario } from '../models/usuario.model';

declare const google: any;

const base_url: string = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario!: Usuario;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _ngZone: NgZone
  ) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigateByUrl('/login');
    // google.accounts.id.revoke('alexggiuliano@gmail.com', () => {
    //   this._ngZone.run(() => {
    //     this._router.navigateByUrl('/login');
    //   });
    // });
  }

  validarToken(): Observable<boolean> {
    return this._http
      .get(`${base_url}/login/renew`, {
        headers: { 'x-token': this.token },
      })
      .pipe(
        map((res: any) => {
          const { email, nombre, google, img = '', role, uid } = res.usuario;
          this.usuario = new Usuario(email, nombre, google, img, '', role, uid);
          localStorage.setItem('token', res.token);
          return true;
        }),
        catchError(() => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this._http
      .post(`${base_url}/usuarios`, formData)
      .pipe(tap((res: any) => localStorage.setItem('token', res.token)));
  }

  actualizarPerfil(data: { email: string; nombre: string; role: string }) {
    data = {
      ...data,
      role: this.usuario.role || 'USER_ROLE',
    };
    return this._http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: { 'x-token': this.token },
    });
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
