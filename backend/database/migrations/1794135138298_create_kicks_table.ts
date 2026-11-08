import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'kicks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('kicked_user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE')
      table.integer('channel_id').unsigned().notNullable()
        .references('id').inTable('channels').onDelete('CASCADE')
      table.integer('kicked_by').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.unique(['channel_id', 'kicked_user_id', 'kicked_by'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}