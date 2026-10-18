<template>
  <q-page padding class="page" :style-fn="pageHeight">
    <div class="text-subtitle2 text-grey-7 text-lowercase">
      #{{ channelMeta !== undefined ? channelMeta.name : 'Unknown chat' }}
    </div>

    <div ref="scroller" class="messages scroll">
      <q-infinite-scroll :key="channelId" reverse :offset="150" @load="onLoad">
        <template #loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" size="32px" />
          </div>
        </template>

        <message
          v-for="msg in messages"
          :key="msg.id"
          :username="msg.username"
          :content="msg.content"
          :timestamp="msg.timestamp"
        />
      </q-infinite-scroll>
    </div>

    <input-bar class="input-bar" @send="addMessage" />
  </q-page>
</template>

<script setup lang="ts">
import InputBar from '@/components/InputBar.vue';
import Message from '@/components/Message.vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { computed, nextTick, ref, watch } from 'vue';
import { useChannelsStore } from '@/stores/channels';

const route = useRoute('/chat/[id]');
const user = useAuthStore();
const channels = useChannelsStore();

interface MessageData {
  id: number;
  username: string;
  content: string;
  timestamp: Date;
}

const channelId = computed(() => Number(route.params.id));
const channelMeta = computed(() => channels.get(channelId.value));

const PAGE_SIZE = 30;
const TOTAL = 100; // pretend the server has 100 messages
let localCount = 0;

const messages = ref<MessageData[]>([]); // oldest -> newest
const scroller = ref<HTMLElement | null>(null);

// Reset when switching chats
watch(
  () => route.params.id,
  () => {
    messages.value = [];
    localCount = 0;
  },
);

// Mock API: returns up to `limit` messages older than `beforeId`
async function fetchMessages(beforeId: number | null, limit: number): Promise<MessageData[]> {
  await new Promise((r) => setTimeout(r, 400));
  const end = beforeId ?? TOTAL; // exclusive
  const start = Math.max(0, end - limit);
  const page: MessageData[] = [];
  for (let i = start; i < end; i++) {
    page.push({
      id: i,
      username: 'John Doe',
      content: `Hello world! #${i}`,
      timestamp: new Date(),
    });
  }
  return page;
}

async function onLoad(index: number, done: (stop?: boolean) => void) {
  const oldest = messages.value[0]?.id ?? null;
  const page = await fetchMessages(oldest, PAGE_SIZE);

  messages.value.unshift(...page); // prepend older messages

  if (index === 1) {
    // first load: jump to the newest message
    await nextTick();
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight;
  }

  // stop once we've reached the beginning of the history
  done(page.length < PAGE_SIZE || page[0]?.id === 0);
}

function pageHeight(offset: number) {
  return { height: offset ? `calc(100vh - ${offset}px)` : '100vh' };
}

function scrollToBottom() {
  const el = scroller.value;
  if (el) el.scrollTop = el.scrollHeight;
}

async function addMessage(message: string) {
  messages.value.push({
    id: TOTAL + localCount++,
    username: user.username,
    timestamp: new Date(),
    content: message,
  });

  await nextTick();
  scrollToBottom();
}
</script>

<style lang="css" scoped>
.page {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
}

.input-bar {
  flex-shrink: 0;
}
</style>
