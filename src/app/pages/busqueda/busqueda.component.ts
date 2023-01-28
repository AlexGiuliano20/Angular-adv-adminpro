import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [],
})
export class BusquedaComponent implements OnInit {
  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(({ termino }) => {
      console.log(termino);
    });
  }
}
