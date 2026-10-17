<template>
  <q-scroll-area class="fit">
    <div class="q-pa-md">
      <!-- new channel button + title -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-subtitle2 text-grey-7 text-uppercase">Channels</div>
        <q-btn flat round dense icon="add" color="primary" @click="isCreateDialogOpen = true">
          <q-tooltip>Create new chat</q-tooltip>
        </q-btn>
      </div>

      <!-- Channel List -->
      <q-list>
        <q-item
          v-for="channel in channels"
          :key="channel.id"
          :to="`/chat/${channel.id}`"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon v-if="channel.isPublic" name="tag" />
            <q-icon v-else name="lock" />
          </q-item-section>
          <q-item-section>{{ channel.name }}</q-item-section>
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

        <q-card-section class="q-pt-md">
          <q-input
            outlined
            v-model="newChatName"
            label="Chat Name"
            placeholder="e.g. general-discussion"
            autofocus
            @keyup.enter="handleCreateChat"
          />
        </q-card-section>

        <q-card-section>
          <q-toggle v-model="newChatIsPublic" toggle-order="ft" label="Public" />
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
import { ref, reactive } from 'vue';

interface Channel {
  id: number;
  name: string;
  isPublic: boolean;
}

// Dialog controls
const isCreateDialogOpen = ref(false);
const newChatName = ref('');
const newChatIsPublic = ref(false);

// Initial channels list
const channels = reactive<Channel[]>([]);
for (let i = 1; i <= 10; i++) {
  channels.push({
    id: i,
    name: `Chat ${i}`,
    isPublic: false,
  });
}

function handleCreateChat() {
  const trimmedName = newChatName.value.trim();
  if (!trimmedName) return;

  // new channel, needs unique id
  const newId = channels.length > 0 ? Math.max(...channels.map((c) => c.id)) + 1 : 1;
  channels.unshift({
    id: newId,
    name: trimmedName,
    isPublic: newChatIsPublic.value,
  });

  // reset input for new chat creation
  newChatName.value = '';
  newChatIsPublic.value = false;
  isCreateDialogOpen.value = false;
}
</script>
