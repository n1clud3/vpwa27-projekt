import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('banned_user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE')
      table.integer('channel_id').unsigned().notNullable()
        .references('id').inTable('channels').onDelete('CASCADE')
      table.integer('banned_by').unsigned().nullable()
        .references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.unique(['channel_id', 'banned_user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}