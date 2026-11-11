import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import Channel from '#models/channel'
import ChannelMember from '#models/channel_member'
import Invite from '#models/invite'
import Ban from '#models/ban'
import { createChannelValidator } from '#validators/channel'

function toDto(channel: Channel, userId: number) {
  return {
    id: channel.id,
    name: channel.name,
    isPrivate: channel.isPrivate,
    isAdmin: channel.adminId === userId,
    lastActivity: channel.lastActivity,
  }
}

export default class ChannelsController {
  /** Get channels */
  async index({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    // remove channels which were inactive for 30 days
    await db
      .from('channels')
      .where('last_activity', '<', DateTime.now().minus({ days: 30 }).toSQL()!)
      .delete()

    const channels = await user
      .related('channels')
      .query()
      .orderBy('channels.last_activity', 'desc')

    const invites = await Invite.query()
      .where('invited_user_id', user.id)
      .where('status', 'pending')
      .preload('channel')
      .preload('inviter')

    return serialize({
      channels: channels.map((c) => toDto(c, user.id)),
      invites: invites.map((i) => ({
        id: i.id,
        channel: toDto(i.channel, user.id),
        invitedBy: i.inviter.nickName,
      })),
    })
  }

  async create({ auth, request, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const { name, isPrivate } = await request.validateUsing(createChannelValidator)

    const channel = await db.transaction(async (trx) => {
      const c = await Channel.create(
        { name, isPrivate: isPrivate ?? false, adminId: user.id },
        { client: trx }
      )
      await ChannelMember.create({ channelId: c.id, userId: user.id }, { client: trx })
      return c
    })

    await channel.refresh()
    return serialize(toDto(channel, user.id))
  }

  async leave({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const membership = await ChannelMember.query()
      .where('channel_id', params.id)
      .where('user_id', user.id)
      .firstOrFail()
    const channel = await Channel.findOrFail(params.id)

    if (channel.adminId === user.id) await channel.delete()
    else await membership.delete()

    return response.noContent()
  }

  /** Remove a channel */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const channel = await Channel.findOrFail(params.id)
    if (channel.adminId !== user.id) {
      return response.forbidden({ errors: [{ message: 'Only the channel admin can delete it' }] })
    }
    await channel.delete()
    return response.noContent()
  }

  async acceptInvite({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const invite = await Invite.query()
      .where('id', params.id)
      .where('invited_user_id', user.id)
      .where('status', 'pending')
      .firstOrFail()

    const banned = await Ban.query()
      .where('channel_id', invite.channelId)
      .where('banned_user_id', user.id)
      .first()
    if (banned) {
      return response.forbidden({ errors: [{ message: 'You are banned from this channel' }] })
    }

    await db.transaction(async (trx) => {
      invite.useTransaction(trx)
      invite.status = 'accepted'
      await invite.save()
      await ChannelMember.firstOrCreate(
        { channelId: invite.channelId, userId: user.id },
        {},
        { client: trx }
      )
    })
    return response.noContent()
  }

  async declineInvite({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const invite = await Invite.query()
      .where('id', params.id)
      .where('invited_user_id', user.id)
      .where('status', 'pending')
      .firstOrFail()
    invite.status = 'declined'
    await invite.save()
    return response.noContent()
  }
}
