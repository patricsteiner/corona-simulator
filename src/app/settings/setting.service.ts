import { Injectable } from '@angular/core';
import { SimulationSettings } from '../simulation/simulation';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private simulationSettings = new BehaviorSubject<SimulationSettings>(SettingService.defaultSettings());
  simulationSettings$ = this.simulationSettings.asObservable();

  currentValue() {
    return this.simulationSettings.getValue();
  }

  set(settings: SimulationSettings) {
    this.simulationSettings.next({ ...settings } as SimulationSettings);
  }

  resetToDefaults() {
    this.simulationSettings.next(SettingService.defaultSettings());
  }

  private static defaultSettings() {
    return {
      initialHealthyPopulation: 99,
      initialInfectedPopulation: 1,
      physicalDistance: 0,
      hygieneRatio: 0,
      stayAtHomeRatio: 0,
      daysUntilRecoveredOrDead: 20,
      lethality: 0.01,
      immunityAfterInfection: .99,
      bordersClosed: false,
    };
  }

}
