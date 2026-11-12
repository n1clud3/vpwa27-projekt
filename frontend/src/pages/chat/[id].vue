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
          :highlighted="msg.mentionsMe"
        />
      </q-infinite-scroll>
    </div>

    <input-bar class="input-bar" @send="sendMessage" @command="onCommand" />
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import InputBar from '@/components/InputBar.vue';
import Message from '@/components/Message.vue';
import { api, ApiError, errorMessage } from '@/api/client';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { computed, nextTick, ref, watch } from 'vue';
import { useChannelsStore } from '@/stores/channels';

const auth = useAuthStore();
const $q = useQuasar();
const router = useRouter();
const route = useRoute('/chat/[id]');
const channels = useChannelsStore();

 interface ApiMessage {
    id: number;
    content: string;
    createdAt: string;
    sender: { id: number; nickName: string; name: string };
    mentionedUserIds: number[];
  }

  interface MessageData {
    id: number;
    username: string;
    content: string;
    timestamp: string;
    mentionsMe: boolean;
  }

  function toMessageData(m: ApiMessage): MessageData {
    return {
      id: m.id,
      username: m.sender.name,
      content: m.content,
      timestamp: m.createdAt,
      mentionsMe: auth.user !== null && m.mentionedUserIds.includes(auth.user.id),
    };
  }

const PAGE_SIZE = 30;

const channelId = computed(() => Number(route.params.id));
const channelMeta = computed(() => channels.byId(channelId.value));

const messages = ref<MessageData[]>([]); // oldest -> newest
const scroller = ref<HTMLElement | null>(null);

// Reset when switching chats
watch(
  () => route.params.id,
  () => {
    messages.value = [];
  },
);


async function onLoad(index: number, done: (stop?: boolean) => void) {
  const id = channelId.value;
  const oldest = messages.value[0]?.id;
  const query =
    oldest !== undefined ? `?limit=${PAGE_SIZE}&before=${oldest}` : `?limit=${PAGE_SIZE}`;

  try {
    const res = await api<{ data: { messages: ApiMessage[]; hasMore: boolean } }>(
      `/channels/${id}/messages${query}`,
    );
    if (id !== channelId.value) return; // the user switched channel while we were loading

    messages.value.unshift(...res.data.messages.map(toMessageData)); // prepend older messages

    if (index === 1) {
      // first load: jump to the newest message
      await nextTick();
      scrollToBottom();
    }

    done(!res.data.hasMore); // stop once we've reached the start of the history
  } catch (e) {
    done(true);
    if (e instanceof ApiError && (e.status === 403 || e.status === 404)) {
      $q.notify({ type: 'negative', message: 'You cannot open this channel' });
      await router.push('/chat');
    } else {
      $q.notify({ type: 'negative', message: errorMessage(e) });
    }
  }
}

function pageHeight(offset: number) {
  return { height: offset ? `calc(100vh - ${offset}px)` : '100vh' };
}

function scrollToBottom() {
  const el = scroller.value;
  if (el) el.scrollTop = el.scrollHeight;
}

async function sendMessage(content: string) {
  try {
    const res = await api<{ data: ApiMessage }>(`/channels/${channelId.value}/messages`, {
      method: 'POST',
      body: { content },
    });
    messages.value.push(toMessageData(res.data));
    await nextTick();
    scrollToBottom();
  } catch (e) {
    $q.notify({ type: 'negative', message: errorMessage(e) });
  }
}

// Placeholder until point 4 (commands) is implemented
function onCommand(name: string) {
  $q.notify({ type: 'info', message: `/${name} is not implemented yet` });
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
