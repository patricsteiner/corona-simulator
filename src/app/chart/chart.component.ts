import { Component, HostListener } from '@angular/core';
import { StatisticService } from './statistic.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.less']
})
export class ChartComponent {

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.view[0] = Math.min(event.target.innerWidth, 800);
  }

  data$ = this.statisticService.data$.pipe(delay(0));
  view = [800, 400];
  customColors = [
    {
      name: 'HEALTHY',
      value: '#0000ff'
    },
    {
      name: 'INFECTED',
      value: '#ff0000'
    },
    {
      name: 'RECOVERED',
      value: '#00aa00'
    }
  ];

  constructor(private statisticService: StatisticService) {
  }

}
