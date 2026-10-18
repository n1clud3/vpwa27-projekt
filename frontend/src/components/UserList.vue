<template>
  <q-scroll-area class="fit">
    <div class="q-pa-md">
      
      <div class="text-subtitle2 text-grey-7 text-uppercase q-mb-sm">
        Members
      </div>

      <q-list>
        <!-- Current User Item -->
        <q-item clickable v-ripple>
          <q-item-section avatar min-width="40px">
            <q-avatar size="36px" color="grey-3" text-color="grey-8">
              <q-icon name="person_outline" />
              <!-- Dynamic Status Indicator Badge -->
              <q-badge
                floating
                rounded
                :color="statusBadgeColor"
                style="top: 24px; right: -2px;"
              />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-medium">
              {{ authStore.username || 'User' }}
              <span class="text-caption text-grey-6">(You)</span>
            </q-item-label>
            <q-item-label caption>
              @{{ nickname }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

    </div>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

type UserStatus = 'online' | 'dnd' | 'offline';

const props = defineProps<{
  status: UserStatus;
  nickname: string;
}>();

const authStore = useAuthStore();

// Compute badge color based on status prop
const statusBadgeColor = computed(() => {
  switch (props.status) {
    case 'online':
      return 'positive'; // Green
    case 'dnd':
      return 'negative'; // Red
    case 'offline':
      return 'grey-5';  // Grey
  }
});
</script>