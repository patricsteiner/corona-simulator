import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Graphics } from './graphics/graphics';
import { Simulation } from './simulation/simulation';
import { State } from './simulation/person';
import { SettingService } from './settings/setting.service';
import { StatisticService } from './chart/statistic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef;
  public context: CanvasRenderingContext2D;
  private g: Graphics;
  private simulation: Simulation;
  private interval: any;

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
    this.g = new Graphics(this.context);
  }

  constructor(private settingService: SettingService, private statisticService: StatisticService) {
    this.settingService.simulationSettings$.subscribe(settings => {
      if (!this.simulation) return;
      this.simulation.updateSettings(settings);
    });

    // canvas.addEventListener('mousedown', function (e: { which: number; }) {
    //   const { x, y } = getCursorPosition(canvas, e);
    //   const person = new Person(x, y);
    //   person.randomizeVelocity();
    //   if (e.which === 1) { // 1 = left mouse button
    //     person.state == State.HEALTHY;
    //   } else if (e.which === 3) { // 3 = right mouse button
    //     person.state = State.INFECTED;
    //   }
    //   s.population.push(person);
    // });
  }

  async start() {
    clearInterval(this.interval);

    const initialHealthyPopulation = 100;
    const initialInfectedPopulation = 3;

    this.simulation = new Simulation(this.canvas.nativeElement.width, this.canvas.nativeElement.height,
      initialHealthyPopulation, initialInfectedPopulation, await this.settingService.currentValue());

    this.interval = setInterval(() => {
      if (this.simulation.tick()) {
        this.statisticService.capture(this.simulation);
      }
      this.draw();
      console.log('tick');
    }, 5);
  }

  draw() {
    this.g.color('lightgrey');
    this.g.fill();
    this.g.rect(0, 0, this.simulation.width, this.simulation.height);
    for (let person of this.simulation.population) {
      switch (person.state) {
        case State.INFECTED: {
          this.g.color('orange');
          this.g.stroke(0.5);
          this.g.circle(person.x, person.y, this.simulation.getInfectionRadius());
          this.g.fill();
          this.g.color('red');
          break;
        }
        case State.HEALTHY: {
          this.g.color('blue');
          break;
        }
        case State.RECOVERED: {
          this.g.color('green');
          break;
        }
      }
      this.g.circle(person.x, person.y, 3);
    }
  }

  getCursorPosition(canvas: any, event: any) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  }
}
