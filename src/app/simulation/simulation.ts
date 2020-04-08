import { Person, State } from './person';
import { Wall } from './wall';

export const TICKS_PER_DAY = 30;
export const WIDTH = 800;
export const HEIGHT = 800;
export const MAX_PHYSICAL_DISTANCE = 7;

export class Simulation {

  readonly population: Person[] = [];
  readonly borders: Wall[] = [];

  private ticks = 0;
  private settings: SimulationSettings;

  constructor(settings: SimulationSettings) {
    for (let i = 0; i < settings.initialHealthyPopulation; i++) {
      this.addPerson(State.HEALTHY);
    }
    for (let i = 0; i < settings.initialInfectedPopulation; i++) {
      this.addPerson(State.INFECTED);
    }
    this.updateSettings(settings);
    this.borders.push(new Wall(WIDTH / 2 - 10, 0, 20, HEIGHT));
    this.borders.push(new Wall(0, HEIGHT / 2 - 10, WIDTH, 20));
  }

  get day() {
    return Math.floor(this.ticks / TICKS_PER_DAY);
  }

  addPerson(state: State) {
    const person = new Person(Math.random() * WIDTH, Math.random() * HEIGHT);
    person.state = state;
    this.population.push(person);
  }

  updateSettings(settings: SimulationSettings) {
    const prevSettings = { ...this.settings } as SimulationSettings;
    this.settings = { ...settings } as SimulationSettings;
    if (prevSettings.stayAtHomeRatio !== this.settings.stayAtHomeRatio) {
      this.applyStayAtHomeRatio();
    }
  }

  physicalDistance() {
    return this.settings.physicalDistance;
  }

  bordersClosed() {
    return this.settings.bordersClosed;
  }

  tick(): boolean {
    const infectionRadius = 1 + 2 * (MAX_PHYSICAL_DISTANCE - this.settings.physicalDistance);
    // the infection radius increases as the physical distance decreases
    this.ticks++;
    const dayIsOver = this.ticks % TICKS_PER_DAY === 0;

    for (let person of this.population) {
      if (person.state !== State.DEAD) {
        this.move(person);
      }

      for (let otherPerson of this.population) {
        if (person.state === State.HEALTHY || person.state === State.RECOVERED && Simulation.chance(1 - this.settings.immunityAfterInfection)) {
          if (otherPerson.state === State.INFECTED && Simulation.distance(person, otherPerson) < infectionRadius && Simulation.chance(1 - this.settings.hygieneRatio)) {
            person.state = State.INFECTED;
          }
        }
      }

      if (person.state === State.INFECTED) {
        if (dayIsOver) {
          person.daysSinceInfection++;
        }
        if (person.daysSinceInfection > this.settings.daysUntilRecoveredOrDead) {
          if (Simulation.chance(this.settings.lethality)) {
            person.state = State.DEAD;
          } else {
            person.state = State.RECOVERED;
          }
          person.daysSinceInfection = 0; // TODO move this stuff to methods in Person class
        }
      }
    }
    return dayIsOver;
  }

  private static chance(probability: number) {
    return Math.random() < probability;
  }

  private applyStayAtHomeRatio() {
    for (let person of this.population) {
      person.randomizeVelocity();
      if (Simulation.chance(this.settings.stayAtHomeRatio)) {
        person.stop();
      }
    }
  }

  private move(person: Person) {
    person.x += person.vx;
    person.y += person.vy;
    if (person.x < 0) {
      person.x = 0;
      person.vx *= -1;
    } else if (person.x > WIDTH) {
      person.x = WIDTH;
      person.vx *= -1;
    }
    if (person.y < 0) {
      person.y = 0;
      person.vy *= -1;
    } else if (person.y > HEIGHT) {
      person.y = HEIGHT;
      person.vy *= -1;
    }
    if (this.settings.bordersClosed) {
      for (let border of this.borders) {
        if (border.contains(person.x, person.y)) {
          person.vx *= -1;
          person.vy *= -1;
        }
      }
    }
  }

  static distance(p1: { x: number; y: number; }, p2: { x: number; y: number; }): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

}

export interface SimulationSettings {
  initialHealthyPopulation: number;
  initialInfectedPopulation: number;
  immunityAfterInfection: number;
  daysUntilRecoveredOrDead: number;
  lethality: number;
  physicalDistance: number;
  hygieneRatio: number;
  stayAtHomeRatio: number;
  bordersClosed: boolean;
}
