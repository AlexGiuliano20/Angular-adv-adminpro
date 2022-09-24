import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [],
})
export class DonaComponent implements OnChanges {
  @Input() title: string = 'Sin título';
  @Input('labels') doughnutChartLabels: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail-Order Sales',
  ];
  @Input() data: number[] = [350, 450, 100];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.doughnutChartData = {
        labels: this.doughnutChartLabels,
        datasets: [
          {
            data: this.data,
            backgroundColor: ['#6857E6', '#009FEE', '#F02059'],
          },
        ],
      };
    }
  }

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: this.data,
        backgroundColor: ['#6857E6', '#009FEE', '#F02059'],
      },
    ],
  };
}
