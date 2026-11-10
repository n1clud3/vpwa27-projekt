import { BanSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Channel from '#models/channel'

export default class Ban extends BanSchema {
  @belongsTo(() => Channel)
  declare channel: BelongsTo<typeof Channel>

  @belongsTo(() => User, { foreignKey: 'bannedUserId' })
  declare bannedUser: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'bannedBy' })
  declare banner: BelongsTo<typeof User>
}
