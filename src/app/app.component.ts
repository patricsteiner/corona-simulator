import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Graphics } from './graphics/graphics';
import { Person, State, Simulation } from './simulation/simulation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef;
  public context: CanvasRenderingContext2D;
  private g: Graphics;
  private s: Simulation;
  private interval: any;

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
    this.g = new Graphics(this.context);
  }

  constructor() {

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

  readParams() {
    let infectionRadius = 11;
    let infectionProbability = 1;
    let isolationRatio = .4;
    let daysUntilRecoveredOrDead = 11;
    let reinfectionProbability = 0;
    const params = {
      infectionRadius,
      infectionProbability,
      isolationRatio,
      daysUntilRecoveredOrDead,
      reinfectionProbability
    };
    return params;
  }

  updateParams() {
    const previousParams = { ...this.s.params }
    this.s.params = this.readParams();
    if (previousParams.isolationRatio !== this.s.params.isolationRatio) {
      this.applyIsolation();
    }
  }

  applyIsolation() {
    for (let person of this.s.population) {
      person.randomizeVelocity();
      if (Math.random() < this.s.params.isolationRatio) {
        person.stop();
      }
    }
  }

  start(): void {
    clearInterval(this.interval);

    const initialHealthyPopulation = 100;
    const initialInfectedPopulation = 3;

    this.s = new Simulation(this.canvas.nativeElement.width, this.canvas.nativeElement.height, this.readParams());
    for (let i = 0; i < initialHealthyPopulation; i++) {
      const person = new Person(Math.random() * this.s.width, Math.random() * this.s.height);
      this.s.population.push(person);
    }
    for (let i = 0; i < initialInfectedPopulation; i++) {
      const person = new Person(Math.random() * this.s.width, Math.random() * this.s.height);
      person.state = State.INFECTED;
      this.s.population.push(person);
    }

    this.applyIsolation();

    this.interval = setInterval(() => {
      this.s.tick();
      this.draw();
      console.log("tick")
    }, 10);
  }

  draw() {
    this.g.color("lightgrey");
    this.g.fill();
    this.g.rect(0, 0, this.s.width, this.s.height);
    for (let person of this.s.population) {
      switch (person.state) {
        case State.INFECTED: {
          this.g.color("orange");
          this.g.stroke(0.5);
          this.g.circle(person.x, person.y, this.s.params.infectionRadius);
          this.g.fill();
          this.g.color("red");
          break;
        }
        case State.HEALTHY: {
          this.g.color("blue");
          break;
        }
        case State.RECOVERED: {
          this.g.color("green");
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
