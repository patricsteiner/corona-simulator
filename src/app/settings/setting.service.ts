import { Injectable } from '@angular/core';
import { SimulationSettings } from '../simulation/simulation';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private simulationSettings = new BehaviorSubject<SimulationSettings>(this.defaultSettings());
  simulationSettings$ = this.simulationSettings.asObservable();

  currentValue() {
    return this.simulationSettings.getValue();
  }

  set(settings: SimulationSettings) {
    this.simulationSettings.next(<SimulationSettings>{ ...settings });
  }

  resetToDefaults() {
    this.simulationSettings.next(this.defaultSettings());
  }

  private defaultSettings() {
    return {
      socialDistance: 3,
      hygieneRatio: .2,
      stayAtHomeRatio: .2,
      daysUntilRecoveredOrDead: 20,
      lethality: 0.01,
      immunityAfterInfection: .99,
      bordersClosed: false,
    };
  }

}
