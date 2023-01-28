import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
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

  get headers() {
    return {
      headers: { 'x-token': this.token },
    };
  }

  guardarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    this._router.navigateByUrl('/login');
  }

  validarToken(): Observable<boolean> {
    return this._http.get(`${base_url}/login/renew`, this.headers).pipe(
      map((res: any) => {
        const { email, nombre, google, img = '', role, uid } = res.usuario;
        this.usuario = new Usuario(email, nombre, google, img, '', role, uid);
        this.guardarLocalStorage(res.token, res.menu);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this._http
      .post(`${base_url}/usuarios`, formData)
      .pipe(tap((res: any) => this.guardarLocalStorage(res.token, res.menu)));
  }

  actualizarPerfil(data: { email: string; nombre: string; role: string }) {
    data = {
      ...data,
      role: this.usuario.role || 'USER_ROLE',
    };

    return this._http.put(
      `${base_url}/usuarios/${this.uid}`,
      data,
      this.headers
    );
  }

  login(formData: LoginForm) {
    return this._http
      .post(`${base_url}/login`, formData)
      .pipe(tap((res: any) => this.guardarLocalStorage(res.token, res.menu)));
  }

  loginGoogle(token: string) {
    return this._http
      .post(`${base_url}/login/google`, { token })
      .pipe(tap((res: any) => this.guardarLocalStorage(res.token, res.menu)));
  }

  cargarUsuarios(desde: number = 0) {
    const url: string = `${base_url}/usuarios?desde=${desde}`;
    return this._http.get<CargarUsuario>(url, this.headers).pipe(
      map((res) => {
        const usuarios = res.usuarios.map(
          (user) =>
            new Usuario(
              user.email,
              user.nombre,
              user.google,
              user.img,
              '',
              user.role,
              user.uid
            )
        );
        return { total: res.total, usuarios };
      })
    );
  }

  eliminarUsuario(usuario: Usuario) {
    const url: string = `${base_url}/usuarios/${usuario.uid}`;
    return this._http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario) {
    return this._http.put(
      `${base_url}/usuarios/${usuario.uid}`,
      usuario,
      this.headers
    );
  }
}
