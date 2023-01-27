import { Component, OnInit } from '@angular/core';

import { delay, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit {
  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private _imgSubs!: Subscription;

  constructor(
    private _hospitalService: HospitalService,
    private _modalImagenService: ModalImagenService,
    private _busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.cargarHospitales();

    this._imgSubs = this._modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe({
        next: () => this.cargarHospitales(),
      });
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.cargarHospitales();
      return;
    }
    this._busquedasService.buscar('hospitales', termino).subscribe({
      next: (res) => (this.hospitales = res),
    });
  }

  cargarHospitales() {
    this.cargando = true;
    this._hospitalService.cargarHospitales().subscribe({
      next: (hospitales) => {
        this.cargando = false;
        this.hospitales = hospitales;
      },
    });
  }

  guardarCambios(hospital: Hospital) {
    if (hospital._id) {
      this._hospitalService
        .actualizarHospital(hospital._id, hospital.nombre)
        .subscribe({
          next: (res) => {
            Swal.fire('Actualizado', hospital.nombre, 'success');
          },
        });
    }
  }

  eliminarHospital(hospital: Hospital) {
    if (hospital._id) {
      this._hospitalService.borrarHospital(hospital._id).subscribe({
        next: (res) => {
          this.cargarHospitales();
          Swal.fire('Borrado', hospital.nombre, 'success');
        },
      });
    }
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    });

    if (value?.trim().length > 0) {
      this._hospitalService.crearHospital(value).subscribe({
        next: (res: any) => {
          this.hospitales.push(res.hospital);
        },
      });
    }
  }

  abrirModal(hospital: Hospital) {
    this._modalImagenService.abrirModal(
      'hospitales',
      hospital._id || '',
      hospital.img
    );
  }
}
