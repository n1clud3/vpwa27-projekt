<template>
  <q-scroll-area class="fit">
    <div class="q-pa-md">
      <!-- Header with Channels title and Create button -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-subtitle2 text-grey-7 text-uppercase">Channels</div>
        <q-btn flat round dense icon="add" color="primary" @click="isCreateDialogOpen = true">
          <q-tooltip>Create new chat</q-tooltip>
        </q-btn>
      </div>

      <!-- Channel List -->
      <q-list>
        <!-- list channel invites first -->
        <q-item v-for="inv in channelsStore.invites" :key="`inv-${inv.id}`" class="bg-amber-1">
          <q-item-section avatar><q-icon name="mail" color="amber-8" /></q-item-section>
          <q-item-section>
            <q-item-label>{{ inv.channel.name }}</q-item-label>
            <q-item-label caption>Invited by @{{ inv.invitedBy }}</q-item-label>
          </q-item-section>
          <q-item-section side class="row no-wrap">
            <q-btn
              flat
              dense
              round
              icon="check"
              color="positive"
              @click="channelsStore.respondToInvite(inv.id, true)"
            />
            <q-btn
              flat
              dense
              round
              icon="close"
              color="negative"
              @click="channelsStore.respondToInvite(inv.id, false)"
            />
          </q-item-section>
        </q-item>
        <!-- list channels a user is participating in -->
        <q-item
          v-for="channel in channelsStore.list"
          :key="channel.id"
          :to="`/chat/${channel.id}`"
          clickable
          v-ripple
        >
          <!-- Dynamic Icon: lock if private, tag if public -->
          <q-item-section avatar min-width="32px">
            <q-icon :name="channel.isPrivate ? 'lock' : 'tag'" />
          </q-item-section>

          <!-- Channel Name -->
          <q-item-section>{{ channel.name }}</q-item-section>

          <!-- Member List Toggle button and Channel Leave button-->
          <q-item-section side>
            <q-btn
              flat
              round
              dense
              size="sm"
              :icon="channel.isAdmin ? 'delete' : 'logout'"
              :color="channel.isAdmin ? 'negative' : 'grey-7'"
              @click.stop.prevent="confirmRemove(channel)"
            >
              <q-tooltip>{{ channel.isAdmin ? 'Delete channel' : 'Leave channel' }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="people"
              size="sm"
              color="grey-7"
              @click.stop.prevent="emit('toggle-user-drawer')"
            >
              <q-tooltip>Toggle Member List</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Create Chat Dialog -->
    <q-dialog v-model="isCreateDialogOpen">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Create New Chat</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md column q-gutter-md">
          <!-- Chat Name Input -->
          <q-input
            outlined
            v-model="newChatName"
            label="Chat Name"
            placeholder="e.g. general-discussion"
            autofocus
            @keyup.enter="handleCreateChat"
          />

          <!-- Private Channel Toggle -->
          <div class="row items-center justify-between q-py-xs">
            <div>
              <div class="text-body2 text-weight-medium">Private Channel</div>
              <div class="text-caption text-grey-7">Only invited members can view this channel</div>
            </div>
            <q-toggle v-model="isPrivate" color="primary" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="primary"
            label="Create"
            @click="handleCreateChat"
            :disable="!newChatName.trim()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useChannelsStore, type Channel } from '@/stores/channels';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { errorMessage } from '@/api/client';

// Emit event to parent layout (chat.vue)
const emit = defineEmits<{
  (e: 'toggle-user-drawer'): void;
}>();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const channelsStore = useChannelsStore();

const isCreateDialogOpen = ref(false);
const newChatName = ref('');
const isPrivate = ref(false);

onMounted(async () => {
  try {
    await channelsStore.fetch();
  } catch (e) {
    $q.notify({ type: 'negative', message: errorMessage(e) });
  }
});

async function handleCreateChat() {
  const name = newChatName.value.trim();
  if (!name) return;
  try {
    const channel = await channelsStore.create(name, isPrivate.value);
    newChatName.value = '';
    isPrivate.value = false;
    isCreateDialogOpen.value = false;
    await router.push(`/chat/${channel.id}`);
  } catch (e) {
    $q.notify({ type: 'negative', message: errorMessage(e) });
  }
}

function confirmRemove(channel: Channel) {
  const action = channel.isAdmin ? 'Delete' : 'Leave';
  $q.dialog({
    title: `${action} #${channel.name}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void (async () => {
      try {
        if (channel.isAdmin) await channelsStore.remove(channel.id);
        else await channelsStore.leave(channel.id);
        if (route.path === `/chat/${channel.id}`) await router.push('/chat');
      } catch (e) {
        $q.notify({ type: 'negative', message: errorMessage(e) });
      }
    })();
  });
}
</script>
