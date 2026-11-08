import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channels'

  async up() {
  this.schema.createTable(this.tableName, (table) => {
    table.increments('id').notNullable()
    table.string('name', 100).notNullable()
    table.boolean('is_private').notNullable().defaultTo(false)
    table.integer('admin_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE')
    table.timestamp('last_activity').notNullable().defaultTo(this.now())
    table.timestamp('created_at').notNullable().defaultTo(this.now())
  })
  this.schema.raw('CREATE UNIQUE INDEX channels_name_lower_unique ON channels (lower(name))')
}

  async down() {
    this.schema.dropTable(this.tableName)
  }
}