import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';

const base_url: string = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  constructor(private _http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: { 'x-token': this.token },
    };
  }

  cargarHospitales() {
    const url: string = `${base_url}/hospitales`;
    return this._http
      .get<Hospital[]>(url, this.headers)
      .pipe(map((res: any) => res.hospitales));
  }

  crearHospital(nombre: string) {
    const url: string = `${base_url}/hospitales`;
    return this._http.post(url, { nombre }, this.headers);
  }

  actualizarHospital(_id: string, nombre: string) {
    const url: string = `${base_url}/hospitales/${_id}`;
    return this._http.put(url, { nombre }, this.headers);
  }

  borrarHospital(_id: string) {
    const url: string = `${base_url}/hospitales/${_id}`;
    return this._http.delete(url, this.headers);
  }
}
