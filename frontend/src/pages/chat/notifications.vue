<template>
  <q-page padding class="page">
    <div class="text-subtitle2 text-grey-7">Recent notifications</div>
    <q-list>
      <q-item
        v-for="[id, notification] of notifications.list.entries()"
        :key="id"
        :to="`/chat/${notification.channelId}`"
        clickable
        v-ripple
      >
        <q-item-section>
          <div class="text-subtitle2 text-grey-8">
            From @{{ notification.fromUser }} in #{{ channels.byId(testNotif!.channelId)?.name }}
          </div>
          <div>{{ notification.content }}</div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { useChannelsStore } from '@/stores/channels';
import { useNotificationsStore } from '@/stores/notifications';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();
const channels = useChannelsStore();
const notifications = useNotificationsStore();

console.table(channels.list);

const testNotif = notifications.list[0];
$q.notify({
  message: `New message in #${channels.byId(testNotif!.channelId)?.name}`,
  caption: `@${testNotif?.fromUser}: ${testNotif?.content}`,
  icon: 'chat',
  color: 'primary',
  actions: [
    {
      label: 'Open',
      color: 'white',
      handler: () => {
        void router.push(`/chat/${testNotif!.channelId}`);
      },
    },
    { icon: 'close', color: 'white' },
  ],
});
</script>
