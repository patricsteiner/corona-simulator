class Simulation {

    ticks = 0;
    TICKS_PER_DAY = 10;
    population = [];

    constructor(width, height, params) {
        this.width = width;
        this.height = height;
        this.params = params;
    }

    tick() {
        this.ticks++;
        const dayIsOver = this.ticks % this.TICKS_PER_DAY === 0;
        for (let person of this.population) {
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

            for (let otherPerson of this.population) {
                if (person.state === State.HEALTHY || person.state === State.RECOVERED && Math.random() < this.params.reinfectionProbability) {
                    if (otherPerson.state === State.INFECTED && distance(person, otherPerson) < this.params.infectionRadius && Math.random() < this.params.infectionProbability) {
                        person.state = State.INFECTED;
                    }
                }
            }

            if (person.state === State.INFECTED) {
                if (dayIsOver) {
                    person.daysSinceInfection++;
                }
                if (person.daysSinceInfection > this.params.daysUntilRecoveredOrDead) {
                    person.state = State.RECOVERED;
                    person.daysSinceInfection = 0; // TODO move this stuff to methods in Person class
                }
            }
        }
    }

}

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

class Person {

    vx = 0;
    vy = 0;
    daysSinceInfection = 0;
    state = State.HEALTHY;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    randomizeVelocity() {
        this.vx = (Math.random() -.5) * 4;
        this.vy = (Math.random() -.5) * 4;
    }

    stop() {
        this.vx = 0;
        this.vy = 0;
    }

}

const State = Object.freeze({
    HEALTHY: "HEALTHY", INFECTED: "INFECTED", RECOVERED: "RECOVERED", IMMUNE: "IMMUNE", DEAD: "DEAD"
});
