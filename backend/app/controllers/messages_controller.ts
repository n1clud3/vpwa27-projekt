import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import Channel from '#models/channel'
import ChannelMember from '#models/channel_member'
import Message from '#models/message'
import type User from '#models/user'
import { sendMessageValidator } from '#validators/message'

const DEFAULT_LIMIT = 30
const MAX_LIMIT = 100

function toDto(message: Message, sender: User) {
  return {
    id: message.id,
    channelId: message.channelId,
    content: message.content,
    createdAt: message.createdAt,
    sender: {
      id: sender.id,
      nickName: sender.nickName,
      name: `${sender.firstName} ${sender.lastName}`,
    },
  }
}

async function isMember(channelId: number, userId: number) {
  const membership = await ChannelMember.query()
    .where('channel_id', channelId)
    .where('user_id', userId)
    .first()
  return membership !== null
}

export default class MessagesController {
  /** GET /channels/:id/messages?before=<messageId>&limit=30 */
  async index({ auth, params, request, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const channel = await Channel.findOrFail(params.id)

    if (!(await isMember(channel.id, user.id))) {
      return response.forbidden({
        errors: [{ message: 'You are not a member of this channel' }],
      })
    }

    const limit = Math.min(Math.max(Number(request.input('limit')) || DEFAULT_LIMIT, 1), MAX_LIMIT)
    const before = Number(request.input('before')) || null

    const query = Message.query()
      .where('channel_id', channel.id)
      .preload('sender')
      .orderBy('id', 'desc')
      .limit(limit + 1) // one extra row tells us whether older messages exist
    if (before) query.where('id', '<', before)

    const rows = await query
    const hasMore = rows.length > limit
    const page = rows.slice(0, limit).reverse() // oldest -> newest

    return serialize({
      messages: page.map((m) => toDto(m, m.sender)),
      hasMore,
    })
  }

  /** POST /channels/:id/messages */
  async store({ auth, params, request, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const channel = await Channel.findOrFail(params.id)

    if (!(await isMember(channel.id, user.id))) {
      return response.forbidden({
        errors: [{ message: 'You are not a member of this channel' }],
      })
    }

    const { content } = await request.validateUsing(sendMessageValidator)

    const message = await db.transaction(async (trx) => {
      const created = await Message.create(
        { channelId: channel.id, senderId: user.id, content },
        { client: trx }
      )
      // a new message counts as channel activity (keeps it alive for 30 days)
      channel.useTransaction(trx)
      channel.lastActivity = DateTime.now()
      await channel.save()
      return created
    })

    response.status(201)
    return serialize(toDto(message, user))
  }
}