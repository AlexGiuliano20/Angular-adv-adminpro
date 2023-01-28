import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [],
})
export class BusquedaComponent implements OnInit {
  public hospitales: Hospital[] = [];
  public medicos: Medico[] = [];
  public usuarios: Usuario[] = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(({ termino }) =>
      this.busquedaGlobal(termino)
    );
  }

  busquedaGlobal(termino: string) {
    this._busquedasService.busquedaGlobal(termino).subscribe({
      next: (res: any) => {
        this.usuarios = res.usuarios;
        this.medicos = res.medicos;
        this.hospitales = res.hospitales;
      },
    });
  }
}
