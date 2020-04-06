import { Component, OnInit } from '@angular/core';
import { StatisticService } from './statistic.service';
import { map,tap } from 'rxjs/operators';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.less']
})
export class ChartComponent {

  data$ = this.statisticService.data$.pipe(
  map(data => { // TODO mk more eficient,....
      const res = [];
      data.forEach((value, key) => {
        res.push({
          name: key,
          series: value.map(e => ({name: e.day.toString(), value: e.amount}))
        })
      });
      return res;
    })
  );

  constructor(private statisticService: StatisticService) {
  }

}
