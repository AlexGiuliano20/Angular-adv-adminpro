import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, tap } from 'rxjs';

import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router
  ) {}

  canLoad(route: Route, segments: UrlSegment[]) {
    return this._usuarioService
      .validarToken()
      .pipe(
        tap(
          (estaAutenticado) =>
            !estaAutenticado && this._router.navigateByUrl('/login')
        )
      );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._usuarioService
      .validarToken()
      .pipe(
        tap(
          (estaAutenticado) =>
            !estaAutenticado && this._router.navigateByUrl('/login')
        )
      );
  }
}
