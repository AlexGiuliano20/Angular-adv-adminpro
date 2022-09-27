import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

export class Usuario {
  constructor(
    public email: string,
    public nombre: string,
    public google?: boolean,
    public img?: string,
    public password?: string,
    public role?: string,
    public uid?: string
  ) {}

  get imagenUrl() {
    if (this.img?.includes('https')) {
      return this.img;
    }
    if (this.img) {
      return `${base_url}/upload/usuarios/${this.img}`;
    }
    return `${base_url}/upload/usuarios/no-image`;
  }
}
