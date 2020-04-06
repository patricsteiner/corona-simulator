import { AfterViewInit, Component } from '@angular/core';
import { StatisticService } from './statistic.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.less']
})
export class ChartComponent implements AfterViewInit {

  data$ = of([]);

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
