import Bag from '../../src/models/Bag';

export const up = (knex) =>
  knex.schema.createTable(Bag.tableName, (table) => {
    table.increments();
    table.timestamps();
    table.integer('volume');
    table.integer('payloadVolume');
    table.integer('availableVolume');
    table.string('title');
  });

export const down = (knex) => knex.schema.dropTable(Bag.tableName);
