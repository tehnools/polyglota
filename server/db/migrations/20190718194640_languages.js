exports.up = function (knex) {
  return knex.schema.createTable('languages', table => {
    table.increments('id').primary().unSigned()
    table.integer('userId')
    table.foreign('userId')
      .references('user.id')
      .onDelete('CASCADE')
    table.string('name')
    table.boolean('isKnown')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('languages')
}