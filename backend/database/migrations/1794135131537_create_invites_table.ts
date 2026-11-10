import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'invites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('channel_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE')
      table
        .integer('invited_user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('invited_by')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.enum('status', ['pending', 'accepted', 'declined']).notNullable().defaultTo('pending')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.unique(['channel_id', 'invited_user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
