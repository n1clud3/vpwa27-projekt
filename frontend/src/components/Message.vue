<template>
  <q-item class="chat-message q-py-sm" dense>
    <q-item-section avatar top>
      <q-avatar size="40px" color="primary" text-color="white">
        <img v-if="avatar" :src="avatar" :alt="username" />
        <span v-else>{{ initials }}</span>
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label class="row items-baseline q-gutter-x-sm">
        <span class="text-weight-bold">{{ username }}</span>
        <span class="text-caption text-grey-6">
          {{ formattedTime }}
          <q-tooltip>{{ fullDate }}</q-tooltip>
        </span>
      </q-item-label>

      <q-item-label class="message-content">
        {{ content }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { date } from 'quasar';

interface Props {
  username: string;
  content: string;
  timestamp: Date | string | number;
  avatar?: string;
}

const props = defineProps<Props>();

const initials = computed(() =>
  props.username
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(),
);

const parsed = computed(() => new Date(props.timestamp));

const formattedTime = computed(() => date.formatDate(parsed.value, 'HH:mm'));
const fullDate = computed(() => date.formatDate(parsed.value, 'DD.MM.YYYY HH:mm:ss'));
</script>

<style scoped>
.message-content {
  white-space: pre-wrap; /* keep line breaks from the user */
  overflow-wrap: anywhere; /* long words/URLs don't overflow */
  line-height: 1.4;
}
.chat-message:hover {
  background: rgba(0, 0, 0, 0.03);
}
</style>
