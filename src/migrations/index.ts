import * as migration_20261019_101732_initial from './20261019_101732_initial';

export const migrations = [
  {
    up: migration_20261019_101732_initial.up,
    down: migration_20261019_101732_initial.down,
    name: '20261019_101732_initial'
  },
];
