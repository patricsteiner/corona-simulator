class Simulation {

    ticks = 0;
    TICKS_PER_DAY = 10;
    population = [];

    constructor(width, height, infectionRadius, infectionProbability, daysUntilRecoveredOrDead, reinfectionProbability) {
        this.width = width;
        this.height = height;
        this.infectionRadius = infectionRadius;
        this.infectionProbability = infectionProbability;
        this.daysUntilRecoveredOrDead = daysUntilRecoveredOrDead;
        this.reinfectionProbability = reinfectionProbability;
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
                if (person.state === State.HEALTHY || person.state === State.RECOVERED && Math.random() < this.reinfectionProbability) {
                    if (otherPerson.state === State.INFECTED && distance(person, otherPerson) < this.infectionRadius && Math.random() < this.infectionProbability) {
                        person.state = State.INFECTED;
                    }
                }
            }

            if (person.state === State.INFECTED) {
                if (dayIsOver) {
                    person.daysSinceInfection++;
                }
                if (person.daysSinceInfection > this.daysUntilRecoveredOrDead) {
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

    vx = (Math.random() -.5) * 4;
    vy = (Math.random() -.5) * 4;
    daysSinceInfection = 0;
    state = Math.random() > .9 ? State.INFECTED : State.HEALTHY;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}

const State = Object.freeze({
    HEALTHY: "HEALTHY", INFECTED: "INFECTED", RECOVERED: "RECOVERED", DEAD: "DEAD"
});
