# Corona Simulator 9000

A visual simulation to help people understand how we can keep the spread of a virus under control.

## TODO
- [X] basic ui with canvas and moving dots
- [X] initial population, infection radius & probability, isolation as configurable params
- [X] realtime update params
- [X] add healthy/infected people by mouse
- [ ] quarantine infected people after x days
- [X] recover
- [X] die
- [ ] increase chance to die when hospitals full
- [X] chance to get reinfected or become immune
- [ ] bug: if 2 persons spawn on top of each other and stay there, they will reinfect each other forever
- [ ] find vaccine
- [X] realtime graphs
- [ ] calculate realworld params (eg what is 2meters?)
- [ ] points of interests (and open/close them)
- [ ] communities and cross-communities
- [ ] smarter movement (eg. avoid other people)
- [X] better ui/sliders
- [X] migrate from raw js to ts (with angular)
- [X] open/close borders
- [ ] cleanup, remove unused modules


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
