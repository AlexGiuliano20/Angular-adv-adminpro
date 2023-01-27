import { Component, OnDestroy, OnInit } from '@angular/core';

import { delay, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  private _imgSubs!: Subscription;

  public cargando: boolean = true;
  public medicos: Medico[] = [];

  constructor(
    private _medicoService: MedicoService,
    private _modalImagenService: ModalImagenService,
    private _busquedasService: BusquedasService
  ) {}

  ngOnDestroy(): void {
    this._imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this._imgSubs = this._modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe({
        next: () => this.cargarMedicos(),
      });
  }

  cargarMedicos() {
    this.cargando = true;
    this._medicoService.cargarMedicos().subscribe({
      next: (medicos) => {
        this.cargando = false;
        this.medicos = medicos;
      },
    });
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.cargarMedicos();
      return;
    }
    this._busquedasService.buscar('medicos', termino).subscribe({
      next: (res) => (this.medicos = res),
    });
  }

  abrirModal(medico: Medico) {
    this._modalImagenService.abrirModal(
      'medicos',
      medico._id || '',
      medico.img
    );
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo.',
    }).then((res) => {
      if (res.value) {
        this._medicoService.borrarMedico(medico._id).subscribe({
          next: () => {
            this.cargarMedicos();
            Swal.fire(
              'Usuario borrado',
              `${medico.nombre} fue eliminado correctamente`,
              'success'
            );
          },
        });
      }
    });
  }
}
