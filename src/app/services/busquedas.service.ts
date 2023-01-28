import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
  constructor(private _http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: { 'x-token': this.token },
    };
  }

  private _transformarUsuarios(res: any[]): Usuario[] {
    return res.map(
      (user) =>
        new Usuario(
          user.nombre,
          user.email,
          user.google,
          user.img,
          '',
          user.role,
          user.uid
        )
    );
  }

  private _transformarHospitales(res: any[]): Hospital[] {
    return res;
  }

  private _transformarMedicos(res: any[]): Medico[] {
    return res;
  }

  busquedaGlobal(termino: string) {
    const url: string = `${base_url}/todo/${termino}`;
    return this._http.get(url, this.headers);
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {
    const url: string = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this._http.get<any[]>(url, this.headers).pipe(
      map((res: any) => {
        switch (tipo) {
          case 'usuarios':
            return this._transformarUsuarios(res.resultados);

          case 'hospitales':
            return this._transformarHospitales(res.resultados);

          case 'medicos':
            return this._transformarMedicos(res.resultados);

          default:
            return [];
        }
      })
    );
  }
}
