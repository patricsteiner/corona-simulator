import { State } from '../simulation/person';

export const stateToColor = {
  [State.HEALTHY]: '#367add',
  [State.INFECTED]: '#ee492b',
  [State.RECOVERED]: '#4aaf45',
  [State.DEAD]: '#9f9f9f',
};
