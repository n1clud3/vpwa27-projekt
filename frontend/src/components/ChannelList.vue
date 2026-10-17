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
          v-for="[id, meta] of Object.entries(channelsStore.channels)"
          :key="id"
          :to="`/chat/${id}`"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon v-if="meta.isPublic" name="tag" />
            <q-icon v-else name="lock" />
          </q-item-section>
          <q-item-section>{{ meta.name }}</q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Create Chat Dialog -->
    <q-dialog v-model="isCreateDialogOpen" @hide="resetCreateChatDialog">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Create New Chat</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-input
            outlined
            v-model.trim="newChatName"
            label="Chat Name"
            placeholder="e.g. general-discussion"
            autofocus
            @keyup.enter="handleCreateChat"
          />
        </q-card-section>

        <q-card-section>
          <q-toggle v-model="newChatIsPublic" toggle-order="ft" label="Public" color="primary" />
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
import { useChannelsStore } from '@/stores/channels';
import { ref } from 'vue';

const channelsStore = useChannelsStore();

// Dialog controls
const isCreateDialogOpen = ref(false);
const newChatName = ref('');
const newChatIsPublic = ref(false);

function handleCreateChat() {
  const name = newChatName.value;
  const isPublic = newChatIsPublic.value;
  if (!name) return;

  channelsStore.add({
    name,
    isPublic,
  });

  isCreateDialogOpen.value = false;
}

function resetCreateChatDialog() {
  newChatName.value = '';
  newChatIsPublic.value = false;
}
</script>
