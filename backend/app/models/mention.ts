import { MentionSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Message from '#models/message'

export default class Mention extends MentionSchema {
  @belongsTo(() => Message)
  declare message: BelongsTo<typeof Message>

  @belongsTo(() => User, { foreignKey: 'mentionedUserId' })
  declare mentionedUser: BelongsTo<typeof User>
}