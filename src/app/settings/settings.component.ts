import { Component, OnDestroy } from '@angular/core';
import { SettingService } from './setting.service';
import { SimulationSettings } from '../simulation/simulation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnDestroy {

  settings: SimulationSettings;
  private sub: Subscription;

  constructor(private settingService: SettingService) {
    this.sub = this.settingService.simulationSettings$.subscribe(settings => {
      this.settings = <SimulationSettings>{ ...settings }; // OMG THIS SHIT COST ME SO MUCH TIME, THIS ABSOLUTELY NEEEDS TO BE COPIED, OBVIOUSLY... FFS...
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  settingsChanged() {
    this.settingService.set(this.settings);
  }

  reset() {
    this.settingService.resetToDefaults();
  }

}
