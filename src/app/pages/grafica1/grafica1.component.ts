import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [],
})
export class Grafica1Component {
  labels1: string[] = ['Hamburguesas', 'Gaseosas', 'Panchos'];
  data1: number[] = [10, 15, 40];
}
