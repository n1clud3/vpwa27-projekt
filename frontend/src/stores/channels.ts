import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Channel {
  id: number;
  name: string;
  isPrivate?: boolean;
}

export const useChannelsStore = defineStore('channels', () => {
  const list = ref<Channel[]>([]);

  function add(name: string, isPrivate: boolean = false) {
    const newId = list.value.length > 0
      ? Math.max(...list.value.map(c => c.id)) + 1
      : 1;

    list.value.unshift({
      id: newId,
      name,
      isPrivate,
    });
  }

  function byId(id: number): Channel | undefined {
    return list.value.find(c => c.id === id);
  }

  return {
    list,
    add,
    byId,
  };
});
