export class Person {

  x: number; // position
  y: number;
  vx = 0; // velocity
  vy = 0;
  daysSinceInfection = 0;
  state = State.HEALTHY;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.randomizeVelocity();
  }

  randomizeVelocity() {
    this.vx = (Math.random() - .5) * 10; // keep in mind: if it moves to fast, it could potentially skip walls...
    this.vy = (Math.random() - .5) * 10;
  }

  stop() {
    this.vx = 0;
    this.vy = 0;
  }

}

export enum State {
  HEALTHY = 'HEALTHY',
  INFECTED = 'INFECTED',
  RECOVERED = 'RECOVERED',
  IMMUNE = 'IMMUNE',
  DEAD = 'DEAD',
}
