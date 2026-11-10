import { ChannelSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import ChannelMember from '#models/channel_member'
import Message from '#models/message'

export default class Channel extends ChannelSchema {
  @belongsTo(() => User, { foreignKey: 'adminId' })
  declare admin: BelongsTo<typeof User>

  @hasMany(() => ChannelMember)
  declare members: HasMany<typeof ChannelMember>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>
}
