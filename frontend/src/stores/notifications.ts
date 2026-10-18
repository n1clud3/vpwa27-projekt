import { defineStore } from "pinia";
import { ref } from "vue";
import type { Notification } from "@/types/notifications";

export const useNotificationsStore = defineStore("notifications", () => {
  const list = ref<Notification[]>([]);

  function add(notif: Notification) {
    list.value.push(notif);
  }

  return {
    list,
    add,
  }
})
