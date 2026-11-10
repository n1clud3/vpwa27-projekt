import { KickSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Channel from '#models/channel'

export default class Kick extends KickSchema {
  @belongsTo(() => Channel)
  declare channel: BelongsTo<typeof Channel>

  @belongsTo(() => User, { foreignKey: 'kickedUserId' })
  declare kickedUser: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'kickedBy' })
  declare kicker: BelongsTo<typeof User>
}
