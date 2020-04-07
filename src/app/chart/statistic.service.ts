import { Injectable } from '@angular/core';
import { State } from '../simulation/person';
import { BehaviorSubject } from 'rxjs';
import { Simulation } from '../simulation/simulation';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private data = [
    {
      name: State.INFECTED.toString(),
      series: []
    },
    {
      name: State.HEALTHY.toString(),
      series: []
    },
    {
      name: State.RECOVERED.toString(),
      series: []
    }
  ];
  data$ = new BehaviorSubject(this.data);

  reset() {
    this.data.forEach(entry => {
      entry.series = [];
    });
    this.data$.next([...this.data]);
  }

  capture(simulation: Simulation) {
    const day = simulation.day;
    const personsPerState = new Map();
    for (let person of simulation.population) {
      if (!personsPerState.has(person.state)) {
        personsPerState.set(person.state, 0);
      }
      personsPerState.set(person.state, personsPerState.get(person.state) + 1);
    }
    this.data[0].series.push(
      {
        name: day.toString(),
        value: personsPerState.get(State.INFECTED) || 0
      }
    );
    this.data[1].series.push(
      {
        name: day.toString(),
        value: personsPerState.get(State.HEALTHY) || 0
      }
    );
    this.data[2].series.push(
      {
        name: day.toString(),
        value: personsPerState.get(State.RECOVERED) || 0
      }
    );
    this.data$.next([...this.data]); // NOTE: just passing a shallow copy... not super safe, but its good enough
  }

}

