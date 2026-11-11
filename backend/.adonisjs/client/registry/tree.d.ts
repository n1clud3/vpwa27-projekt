/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  channels: {
    channels: {
      index: typeof routes['channels.channels.index']
      create: typeof routes['channels.channels.create']
      destroy: typeof routes['channels.channels.destroy']
      leave: typeof routes['channels.channels.leave']
      acceptInvite: typeof routes['channels.channels.accept_invite']
      declineInvite: typeof routes['channels.channels.decline_invite']
    }
  }
}
