import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  constructor(private _http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: { 'x-token': this.token },
    };
  }

  cargarMedicos() {
    const url: string = `${base_url}/medicos`;
    return this._http
      .get<Medico[]>(url, this.headers)
      .pipe(map((res: any) => res.medicos));
  }

  crearMedico(medico: { nombre: string; hospital: string }) {
    const url: string = `${base_url}/medicos`;
    return this._http.post(url, medico, this.headers);
  }

  actualizarMedico(medico: Medico) {
    const url: string = `${base_url}/medicos/${medico._id}`;
    return this._http.put(url, medico, this.headers);
  }

  borrarMedico(_id: string) {
    const url: string = `${base_url}/medicos/${_id}`;
    return this._http.delete(url, this.headers);
  }
}
