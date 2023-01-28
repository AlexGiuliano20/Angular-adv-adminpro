import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [],
})
export class MedicoComponent implements OnInit {
  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado: Medico;
  public hospitalSeleccionado: Hospital;

  constructor(
    private _fb: FormBuilder,
    private _hospitalService: HospitalService,
    private _medicoService: MedicoService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.medicoForm = this._fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find(
        (h) => h._id === hospitalId
      );
    });
  }

  cargarMedico(id: string) {
    if (id === 'nuevo') {
      return;
    }
    this._medicoService.obtenerMedicoPorId(id).subscribe({
      next: (medico) => {
        if (!medico) {
          return this._router.navigateByUrl(`/dashboard/medicos`);
        }
        const {
          nombre,
          hospital: { _id },
        } = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
        this.medicoSeleccionado = medico;
      },
    });
  }

  cargarHospitales() {
    this._hospitalService.cargarHospitales().subscribe({
      next: (hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      },
    });
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;
    if (this.medicoSeleccionado) {
      //Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };
      this._medicoService.actualizarMedico(data).subscribe({
        next: (res) => {
          Swal.fire(
            'Actualizado',
            `${nombre} actualizado correctamente`,
            'success'
          );
        },
      });
    } else {
      //Crear
      this._medicoService.crearMedico(this.medicoForm.value).subscribe({
        next: (res: any) => {
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this._router.navigateByUrl(`/dashboard/medico/${res.medico._id}`);
        },
      });
    }
  }
}
