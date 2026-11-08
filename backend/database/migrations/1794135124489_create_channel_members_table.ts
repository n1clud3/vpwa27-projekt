import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channel_members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE')
      table.integer('channel_id').unsigned().notNullable()
        .references('id').inTable('channels').onDelete('CASCADE')
      table.timestamp('joined_at').notNullable().defaultTo(this.now())
      table.integer('last_read_message').notNullable().defaultTo(0)
      table.enum('notification_preference', ['all', 'mentions_only', 'none'])
        .notNullable().defaultTo('all')
      table.unique(['user_id', 'channel_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}