import { Person, State } from './person';

export class Simulation {

  private ticks = 0;
  readonly TICKS_PER_DAY = 10;

  get day() {
    return Math.floor(this.ticks / this.TICKS_PER_DAY);
  }

  population: Person[] = [];
  width: number;
  height: number;
  private settings: SimulationSettings;

  constructor(width: number, height: number, initialHealthyPopulation: number, initialInfectedPopulation: number, settings: SimulationSettings) {
    this.width = width;
    this.height = height;
    for (let i = 0; i < initialHealthyPopulation; i++) {
      const person = new Person(Math.random() * this.width, Math.random() * this.height);
      this.population.push(person);
    }
    for (let i = 0; i < initialInfectedPopulation; i++) {
      const person = new Person(Math.random() * this.width, Math.random() * this.height);
      person.state = State.INFECTED;
      this.population.push(person);
    }
    this.updateSettings(settings);
  }

  updateSettings(settings: SimulationSettings) {
    const prevSettings = { ...this.settings } as SimulationSettings;
    this.settings = { ...settings } as SimulationSettings;
    if (prevSettings.isolationRatio !== this.settings.isolationRatio) {
      this.applyIsolation();
    }
  }

  getInfectionRadius() {
    return this.settings.infectionRadius;
  }

  tick(): boolean {
    this.ticks++;
    const dayIsOver = this.ticks % this.TICKS_PER_DAY === 0;

    for (let person of this.population) {
      this.move(person);

      for (let otherPerson of this.population) {
        if (person.state === State.HEALTHY || person.state === State.RECOVERED && Math.random() < this.settings.reinfectionProbability) {
          if (otherPerson.state === State.INFECTED && Simulation.distance(person, otherPerson) < this.settings.infectionRadius && Math.random() < this.settings.infectionProbability) {
            person.state = State.INFECTED;
          }
        }
      }

      if (person.state === State.INFECTED) {
        if (dayIsOver) {
          person.daysSinceInfection++;
        }
        if (person.daysSinceInfection > this.settings.daysUntilRecoveredOrDead) {
          person.state = State.RECOVERED;
          person.daysSinceInfection = 0; // TODO move this stuff to methods in Person class
        }
      }
    }
    return dayIsOver;
  }

  private applyIsolation() {
    for (let person of this.population) {
      person.randomizeVelocity();
      if (Math.random() < this.settings.isolationRatio) {
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
    } else if (person.x > this.width) {
      person.x = this.width;
      person.vx *= -1;
    }
    if (person.y < 0) {
      person.y = 0;
      person.vy *= -1;
    } else if (person.y > this.height) {
      person.y = this.height;
      person.vy *= -1;
    }
  }

  static distance(p1: { x: number; y: number; }, p2: { x: number; y: number; }): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

}

export interface SimulationSettings {
  infectionRadius: number;
  infectionProbability: number;
  reinfectionProbability: number;
  isolationRatio: number;
  daysUntilRecoveredOrDead: number;
}
