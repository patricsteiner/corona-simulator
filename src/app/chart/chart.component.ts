import { Component, HostListener, OnInit } from '@angular/core';
import { StatisticService } from './statistic.service';
import { delay } from 'rxjs/operators';
import { stateToColor } from '../shared/constants';

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
  customColors = Object.keys(stateToColor).map(key => ({ name: key, value: stateToColor[key] }));

  constructor(private statisticService: StatisticService) {
  }

  ngOnInit() {
    this.scaleChartSize(window.innerWidth);
  }

  scaleChartSize(windowWidth: number) {
    const width = Math.min(windowWidth, 800);
    const heigth = width < 800 ? 200 : 400;
    this.view = [width, heigth];
  }

}
