import { Injectable } from '@angular/core';
import { State } from '../simulation/person';
import { BehaviorSubject } from 'rxjs';
import { Simulation } from '../simulation/simulation';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private dataSubject = new BehaviorSubject(new Map<State, { day: number, amount: number }[]>());
  data$ = this.dataSubject.asObservable();

  // data: Map<State, number>[] = [];
  // data2$ = new BehaviorSubject(this.data);

  reset() {
    this.dataSubject.next(new Map<State, { day: number, amount: number }[]>());
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
    // this.data[day] = personsPerState;
    // this.data2$.next(this.data);
    const data = this.dataSubject.getValue();
    personsPerState.forEach((amount, state) => {
      if (!data.has(state)) {
        data.set(state, []);
      }
      data.get(state).push({ day, amount })
    });

    this.dataSubject.next(data);
  }

}
