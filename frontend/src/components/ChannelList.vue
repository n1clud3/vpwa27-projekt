<template>
  <q-scroll-area class="fit">
    <div class="q-pa-md">
      
      <!-- Header with Channels title and Create button -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-subtitle2 text-grey-7 text-uppercase">Channels</div>
        <q-btn
          flat
          round
          dense
          icon="add"
          color="primary"
          @click="isCreateDialogOpen = true"
        >
          <q-tooltip>Create new chat</q-tooltip>
        </q-btn>
      </div>

      <!-- Channel List -->
      <q-list>
        <q-item
          v-for="channel in channelsStore.channels"
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

          <!-- Member List Toggle Button (Right Side of Channel) -->
          <q-item-section side>
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
              <div class="text-caption text-grey-7">
                Only invited members can view this channel
              </div>
            </div>
            <q-toggle
              v-model="isPrivate"
              color="primary"
            />
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
import { ref } from 'vue';
import { useChannelsStore } from '../stores/channels';

// Emit event to parent layout (chat.vue)
const emit = defineEmits<{
  (e: 'toggle-user-drawer'): void;
}>();

const channelsStore = useChannelsStore();

const isCreateDialogOpen = ref(false);
const newChatName = ref('');
const isPrivate = ref(false);

function handleCreateChat() {
  const trimmedName = newChatName.value.trim();
  if (!trimmedName) return;

  channelsStore.addChannel(trimmedName, isPrivate.value);

  // Reset input and close modal
  newChatName.value = '';
  isPrivate.value = false;
  isCreateDialogOpen.value = false;
}
</script>