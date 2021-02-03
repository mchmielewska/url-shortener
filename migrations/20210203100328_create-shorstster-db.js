exports.up = function (knex) {
  return knex.schema
    .createTable('urls', (table) => {
      table.increments();
      table.string('fullUrl').notNullable();
      table.string('shortUrl').notNullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
    })
    .createTable('visits', (table) => {
      table.increments();
      table.timestamp('date').defaultTo(knex.fn.now());
      table.integer('urlId').unsigned().notNullable();

      table
        .foreign('urlId')
        .references('id')
        .inTable('urls')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('urls').dropTableIfExists('visits');
};
