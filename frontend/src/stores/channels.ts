import { api } from '@/api/client';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Channel {
  id: number;
  name: string;
  isPrivate: boolean;
  isAdmin: boolean;
}

export interface ChannelInvite {
  id: number;
  channel: Channel;
  invitedBy: string;
}

export const useChannelsStore = defineStore('channels', () => {
  const list = ref<Channel[]>([]);
  const invites = ref<ChannelInvite[]>([]);

  async function fetch() {
    const res = await api<{ data: { channels: Channel[]; invites: ChannelInvite[] } }>('/channels');
    list.value = res.data.channels;
    invites.value = res.data.invites;
  }

  async function create(name: string, isPrivate: boolean) {
    const res = await api<{ data: Channel }>('/channels', {
      method: 'POST',
      body: { name, isPrivate },
    });
    list.value.unshift(res.data);
    return res.data;
  }

  async function leave(id: number) {
    await api(`/channels/${id}/membership`, { method: 'DELETE' });
    list.value = list.value.filter((c) => c.id !== id);
  }

  async function remove(id: number) {
    await api(`/channels/${id}`, { method: 'DELETE' });
    list.value = list.value.filter((c) => c.id !== id);
  }

  async function respondToInvite(inviteId: number, accept: boolean) {
    await api(`/channels/invites/${inviteId}/${accept ? 'accept' : 'decline'}`, { method: 'POST' });
    await fetch();
  }

  function byId(id: number): Channel | undefined {
    return list.value.find((c) => c.id === id);
  }

  async function join(name: string, isPrivate: boolean) {
    const res = await api<{ data: Channel }>('/channels/join', {
      method: 'POST',
      body: { name, isPrivate },
    });
    // endpoint is idempotent, so avoid duplicates if already a member
    if (!list.value.some((c) => c.id === res.data.id)) list.value.unshift(res.data);
    return res.data;
  }

  function $reset() {
    list.value = [];
    invites.value = [];
  }

  return {
    list,
    invites,
    fetch,
    create,
    join,
    leave,
    remove,
    respondToInvite,
    byId,
    $reset,
  };
});
