import { Injectable } from '@angular/core';
import { SimulationSettings } from '../simulation/simulation';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private simulationSettings = new BehaviorSubject<SimulationSettings>(
    {
      infectionRadius: 10,
      infectionProbability: .8,
      isolationRatio: .4,
      daysUntilRecoveredOrDead: 20,
      reinfectionProbability: .1,
      bordersClosed: false,
    }
  );
  simulationSettings$ = this.simulationSettings.asObservable();

  currentValue() {
    return this.simulationSettings.getValue();
  }

  set(settings: SimulationSettings) {
    this.simulationSettings.next(<SimulationSettings>{ ...settings });
  }

}
