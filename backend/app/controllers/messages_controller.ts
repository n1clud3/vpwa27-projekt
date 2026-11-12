import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import Channel from '#models/channel'
import ChannelMember from '#models/channel_member'
import Mention from '#models/mention'
import Message from '#models/message'
import User from '#models/user'
import { sendMessageValidator } from '#validators/message'

const DEFAULT_LIMIT = 30
const MAX_LIMIT = 100

function toDto(message: Message, sender: User, mentionedUserIds: number[]) {
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
    mentionedUserIds,
  }
}

async function isMember(channelId: number, userId: number) {
  const membership = await ChannelMember.query()
    .where('channel_id', channelId)
    .where('user_id', userId)
    .first()
  return membership !== null
}

/** Nicknames written as @nickname (an @ glued to a word, like in an email, is ignored). */
function extractNicknames(content: string): string[] {
  const found = new Set<string>()
  for (const match of content.matchAll(/(?<!\w)@(\w+)/g)) {
    const nick = match[1]
    if (nick) found.add(nick.toLowerCase())
  }
  return [...found]
}

/** Ids of the users addressed in the message: channel members only (the sender included). */
async function findMentionedUserIds(content: string, channelId: number) {
  const nicknames = extractNicknames(content)
  if (nicknames.length === 0) return []

  const members = await User.query().whereIn(
    'id',
    db.from('channel_members').select('user_id').where('channel_id', channelId)
  )

  return members.filter((u) => nicknames.includes(u.nickName.toLowerCase())).map((u) => u.id)
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
      .preload('mentions')
      .orderBy('id', 'desc')
      .limit(limit + 1) // one extra row tells us whether older messages exist
    if (before) query.where('id', '<', before)

    const rows = await query
    const hasMore = rows.length > limit
    const page = rows.slice(0, limit).reverse() // oldest -> newest

    return serialize({
      messages: page.map((m) =>
        toDto(
          m,
          m.sender,
          m.mentions.map((x) => x.mentionedUserId)
        )
      ),
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
    const mentionedUserIds = await findMentionedUserIds(content, channel.id)

    const message = await db.transaction(async (trx) => {
      const created = await Message.create(
        { channelId: channel.id, senderId: user.id, content },
        { client: trx }
      )

      if (mentionedUserIds.length > 0) {
        await Mention.createMany(
          mentionedUserIds.map((id) => ({ messageId: created.id, mentionedUserId: id })),
          { client: trx }
        )
      }

      // a new message counts as channel activity (keeps it alive for 30 days)
      channel.useTransaction(trx)
      channel.lastActivity = DateTime.now()
      await channel.save()

      return created
    })

    response.status(201)
    return serialize(toDto(message, user, mentionedUserIds))
  }
}