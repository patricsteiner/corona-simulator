import { AfterViewInit, Component, HostListener } from '@angular/core';
import { StatisticService } from './statistic.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.less']
})
export class ChartComponent implements AfterViewInit {

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.view[0] = Math.min(event.target.innerWidth, 800);
  }

  data$ = of([]);
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

  ngAfterViewInit() {
    this.data$ = this.statisticService.data$.pipe(
      map(data => { // TODO mk more eficient,....
        const res = [];
        data.forEach((value, key) => {
          res.push({
            name: key,
            series: value.map(e => ({ name: e.day.toString(), value: e.amount }))
          });
        });
        return res;
      })
    );
  }

}
