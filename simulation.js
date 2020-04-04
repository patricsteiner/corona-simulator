class Simulation {

    population = [];

    constructor(width, height, infectionRadius, infectionProbability) {
        this.width = width;
        this.height = height;
        this.infectionRadius = infectionRadius;
        this.infectionProbability = infectionProbability;
    }

    tick() {
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
                if (otherPerson.infected && distance(person, otherPerson) < this.infectionRadius && Math.random() < this.infectionProbability) {
                    person.infected = true;
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
    infected = Math.random() > .9;
    daysSinceInfection = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}
