import { Component, HostListener, OnInit } from '@angular/core';
import { StatisticService } from './statistic.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.less']
})
export class ChartComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scaleChartSize(event.target.innerWidth);
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

  ngOnInit() {
    this.scaleChartSize(window.innerWidth);
  }

  scaleChartSize(windowWidth: number) {
    this.view = [Math.min(windowWidth, 800), 400];
  }

}
