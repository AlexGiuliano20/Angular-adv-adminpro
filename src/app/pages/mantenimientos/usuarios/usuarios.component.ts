import { Component, OnDestroy, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { delay, Subscription } from 'rxjs';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public imgSubs!: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(
    private _usuarioService: UsuarioService,
    private _busquedasService: BusquedasService,
    private _modalImagenService: ModalImagenService
  ) {}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this._modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe({
        next: () => this.cargarUsuarios(),
      });
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde).subscribe({
      next: ({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      },
    });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp;
      return;
    }
    this._busquedasService
      .buscar('usuarios', termino)
      .subscribe((res: Usuario[]) => {
        this.usuarios = res;
      });
  }

  eliminarUsuario(usuario: Usuario): any {
    if (usuario.uid === this._usuarioService.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo.',
    }).then((res) => {
      if (res.value) {
        this._usuarioService.eliminarUsuario(usuario).subscribe({
          next: () => {
            this.cargarUsuarios();
            Swal.fire(
              'Usuario borrado',
              `${usuario.nombre} fue eliminado correctamente`,
              'success'
            );
          },
        });
      }
    });
  }

  cambiarRole(usuario: Usuario) {
    this._usuarioService.guardarUsuario(usuario).subscribe({
      next: (res) => console.log(res),
    });
  }

  abrirModal(usuario: Usuario) {
    this._modalImagenService.abrirModal(
      'usuarios',
      usuario.uid || '',
      usuario.img
    );
  }
}
