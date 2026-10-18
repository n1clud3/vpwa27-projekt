<template>
  <template v-if="IS_TYPING_DEMO">
    <!-- Typing indicator -->
    <div
      class="cursor-pointer typing-indicator q-px-md q-py-xs text-caption text-grey-7"
      @click="showTypingModal = true"
    >
      <q-icon name="more_horiz" size="xs" class="q-mr-xs" />
      <span class="text-primary text-weight-medium"> @{{ typingUser.username }} </span>
      is typing ...
    </div>

    <!-- Realtime draft modal -->
    <q-dialog v-model="showTypingModal">
      <q-card style="min-width: 350px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ typingUser.name }} is typing</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <message :username="typingUser.username" :content="typingUser.draft" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
  <q-list v-if="isCommand">
    <q-item v-for="command in commands.list" :key="command.name" class="command-entry">
      <span class="text-bold name">/{{ command.name }}</span>
      <span v-for="param in command.params" :key="param.name" class="param"> {{ param.name }}</span>
      <span class="desc">{{ command.description }}</span>
    </q-item>
  </q-list>

  <div v-if="hasMention && !isCommand" class="mention-preview">
    <template v-for="(part, i) in parts" :key="i">
      <span v-if="i % 2" class="mention">{{ part }}</span>
      <template v-else>{{ part }}</template>
    </template>
  </div>

  <q-input
    v-model="text"
    standout="bg-primary text-white"
    dense
    autofocus
    placeholder="Message or /command"
    :disable="disable"
    @keydown.enter.exact.prevent="submit"
  >
    <template #prepend>
      <q-icon :name="isCommand ? 'terminal' : 'chat'" />
    </template>

    <template #append>
      <q-btn round flat dense icon="send" :disable="!text.trim() || disable" @click="submit" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref } from 'vue';
import { useCommandsStore } from '@/stores/commands';
import Message from './Message.vue';

const IS_TYPING_DEMO = true;
const showTypingModal = ref(false);

const typingUser = ref({
  username: 'johndoe',
  name: 'John Doe',
  draft: '',
});

const demoText = 'Hey, are we still meeting tomorrow? I can do 3pm if that works for you.';
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  if (!IS_TYPING_DEMO) return;
  let i = 0;
  typingUser.value.draft = '';
  timer = setInterval(() => {
    typingUser.value.draft = demoText.slice(0, ++i);
    if (i >= demoText.length) i = 0; // loop
  }, 80);
});

onBeforeUnmount(() => clearInterval(timer));

const commands = useCommandsStore();

defineProps<{ disable?: boolean }>();

const emit = defineEmits<{
  (e: 'send', message: string): void;
  (e: 'command', name: string, args: string[]): void;
}>();

const text = ref('');
const isCommand = computed(() => text.value.startsWith('/'));

const parts = computed(() => text.value.split(/(@[\w-]+)/));
const hasMention = computed(() => parts.value.length > 1);

function submit() {
  const value = text.value.trim();
  if (!value) return;

  if (value.startsWith('/')) {
    const [name, ...args] = value.slice(1).split(/\s+/);
    emit('command', name!.toLowerCase(), args);
  } else {
    emit('send', value);
  }
  text.value = '';
}
</script>

<style lang="scss" scoped>
.command-entry {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: start;
  gap: 0.5rem;

  font-family: 'Roboto Mono', monospace;

  .param,
  .name,
  .desc {
    padding: 5px 10px;
  }

  .param {
    background-color: rgba(0, 0, 0, 0.2);
  }
}

.mention-preview {
  padding: 4px 12px;
  font-size: 0.85rem;
  white-space: pre-wrap;
  word-break: break-word;
  opacity: 0.9;

  .mention {
    color: var(--q-primary);
    background-color: rgba(25, 118, 210, 0.15);
    border-radius: 4px;
    padding: 0 3px;
    font-weight: 500;
  }
}
</style>
