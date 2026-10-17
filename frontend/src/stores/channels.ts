import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';
import type { Channel, ChannelList } from '@/types/channels';

export const useChannelsStore = defineStore('channels', () => {
  const channels = ref<ChannelList>({});
  let nextId = 1;

  function add(data: Channel) {
    const id = nextId++;
    channels.value[id] = data;
  }

  function get(id: number) {
    return channels.value[id];
  }

  return {
    channels,
    add,
    get,
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelsStore, import.meta.hot));
}
