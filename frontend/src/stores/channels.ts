import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Channel {
  id: number;
  name: string;
  isPrivate?: boolean;
}

export const useChannelsStore = defineStore('channels', () => {
  const channels = ref<Channel[]>([]);

  function addChannel(name: string, isPrivate: boolean = false) {
    const newId = channels.value.length > 0 
      ? Math.max(...channels.value.map(c => c.id)) + 1 
      : 1;
    
    channels.value.unshift({
      id: newId,
      name,
      isPrivate,
    });
  }

  function getChannelById(id: number) {
    return channels.value.find(c => c.id === id);
  }

  return {
    channels,
    addChannel,
    getChannelById,
  };
});