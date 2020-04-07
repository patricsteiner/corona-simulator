import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Graphics } from './graphics/graphics';
import { HEIGHT, Simulation, WIDTH } from './simulation/simulation';
import { Person, State } from './simulation/person';
import { SettingService } from './settings/setting.service';
import { StatisticService } from './chart/statistic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scaleCanvas(event.target.innerWidth);
    this.draw();
  }

  @ViewChild('canvas') canvas: ElementRef;
  private context: CanvasRenderingContext2D;
  private graphics: Graphics;
  private simulation: Simulation;
  private scaleFactor = 1;
  private simulationLoop: any;
  speed = 175;
  paused = false;

  constructor(private settingService: SettingService, private statisticService: StatisticService) {
    this.settingService.simulationSettings$.subscribe(settings => {
      if (!this.simulation) return;
      this.simulation.updateSettings(settings);
      this.draw();
    });
  }

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    this.context = canvas.getContext('2d');
    this.graphics = new Graphics(this.context);
    this.scaleCanvas(window.innerWidth);
    this.restartSimulation();
    this.setSimulationLoop();
  }

  setSimulationLoop() {
    if (this.simulationLoop) clearInterval(this.simulationLoop);
    const delay = 201 - this.speed;
    this.simulationLoop = setInterval(() => {
      if (this.paused) return;
      if (this.simulation.tick()) {
        this.statisticService.capture(this.simulation);
      }
      this.draw();
    }, delay);
  }

  scaleCanvas(windowWidth: number) {
    this.scaleFactor = Math.min(windowWidth / WIDTH, 1);
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    canvas.width = WIDTH * this.scaleFactor;
    canvas.height = HEIGHT * this.scaleFactor;
    this.context.scale(this.scaleFactor, this.scaleFactor);
  }

  onMouseDown(event: MouseEvent) {
    const { x, y } = AppComponent.getCanvasClickPosition(this.context.canvas, event, this.scaleFactor);
    const person = new Person(x, y);
    if (event.which === 1) { // 1 = left mouse button
      person.state = State.HEALTHY;
    } else if (event.which === 3) { // 3 = right mouse button
      person.state = State.INFECTED;
    }
    this.simulation.population.push(person);
    this.draw();
  }

  restartSimulation() {
    const initialHealthyPopulation = 100;
    const initialInfectedPopulation = 1;

    this.simulation = new Simulation(initialHealthyPopulation, initialInfectedPopulation, this.settingService.currentValue());
    this.statisticService.reset();
    this.statisticService.capture(this.simulation);
    this.draw();
  }

  resetSettings() {
    this.settingService.resetToDefaults();
  }

  togglePause() {
    this.paused = !this.paused;
  }

  draw() {
    const g = this.graphics;
    g.color('lightgrey');
    g.fill();
    g.rect(0, 0, WIDTH, HEIGHT);
    for (let border of this.simulation.borders) {
      g.color(this.simulation.bordersClosed() ? 'black' : 'lightgrey');
      g.rect(border.x, border.y, border.width, border.height);
    }
    const socialDistance = this.simulation.getSocialDistance();
    g.fill();
    for (let person of this.simulation.population) {
      if (socialDistance < 10) { // we invert it, a high social distance means a small extra infection radius
        g.color('#eeeeee');
        g.circle(person.x, person.y, 10 - socialDistance);
      }
      switch (person.state) {
        case State.INFECTED: {
          g.color('red');
          break;
        }
        case State.HEALTHY: {
          g.color('blue');
          break;
        }
        case State.RECOVERED: {
          g.color('green');
          break;
        }
      }
      g.circle(person.x, person.y, 3);
    }
  }

  static getCanvasClickPosition(canvas: HTMLCanvasElement, event: MouseEvent, scaleFactor: number) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scaleFactor;
    const y = (event.clientY - rect.top) / scaleFactor;
    return { x, y };
  }
}
