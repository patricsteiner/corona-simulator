import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Graphics } from './graphics/graphics';
import { HEIGHT, MAX_PHYSICAL_DISTANCE, Simulation, WIDTH } from './simulation/simulation';
import { Person, State } from './simulation/person';
import { SettingService } from './settings/setting.service';
import { StatisticService } from './chart/statistic.service';
import { stateToColor } from './shared/constants';

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
  paused = true;
  fastForward = false;
  addHealthyOnClick = true;

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
    const delay = this.fastForward ? 5 : 30;
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
    const leftButtonState = this.addHealthyOnClick ? State.HEALTHY : State.INFECTED;
    const rightButtonState = this.addHealthyOnClick ? State.INFECTED : State.HEALTHY;
    if (event.which === 1) { // 1 = left mouse button
      person.state = leftButtonState;
    } else if (event.which === 3) { // 3 = right mouse button
      person.state = rightButtonState;
    }
    this.simulation.population.push(person);
    this.draw();
  }

  restartSimulation() {
    this.paused = true;
    this.simulation = new Simulation(this.settingService.currentValue());
    this.statisticService.reset();
    this.statisticService.capture(this.simulation);
    this.draw();
  }

  togglePause() {
    this.paused = !this.paused;
  }

  toggleFastForward() {
    this.fastForward = !this.fastForward;
    this.setSimulationLoop();
  }

  draw() {
    const g = this.graphics;
    const bgColor = '#fafafa';
    g.color(bgColor);
    g.fill();
    g.rect(0, 0, WIDTH, HEIGHT);
    for (let border of this.simulation.borders) {
      g.color(this.simulation.bordersClosed() ? 'darkgray' : bgColor);
      g.rect(border.x, border.y, border.width, border.height);
    }
    const physicalDistance = this.simulation.physicalDistance();
    g.fill();
    for (let person of this.simulation.population) {
      if (person.state === State.DEAD) {
        g.text('💀', person.x, person.y, 14);
      } else {
        g.color(stateToColor[person.state]);
        g.circle(person.x, person.y, 2 + MAX_PHYSICAL_DISTANCE - physicalDistance);
        // we invert it, a high social distance means a small extra infection radius. we add 2 just because otherwise we cant see shit.
      }
    }
  }

  static getCanvasClickPosition(canvas: HTMLCanvasElement, event: MouseEvent, scaleFactor: number) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scaleFactor;
    const y = (event.clientY - rect.top) / scaleFactor;
    return { x, y };
  }
}
