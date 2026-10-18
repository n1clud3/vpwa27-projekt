import { defineBoot } from '#q-app';
import { useChannelsStore } from '@/stores/channels';
import { useCommandsStore } from '@/stores/commands';
import { useNotificationsStore } from '@/stores/notifications';

function initCommands() {
  const commands = useCommandsStore();
  commands.add({
    name: "join",
    availableOutOfChannel: false,
    description: "Join a channel",
    params: [
      {
        name: "channel-name",
        mandatory: true,
      }
    ]
  });

  commands.add({
    name: "mute",
    availableOutOfChannel: true,
    description: "Mute a member in this channel",
    params: [
      {
        name: "username",
        mandatory: true,
      },
      {
        name: "duration",
        mandatory: false,
      }
    ]
  });
}

function initChannels() {
  const channels = useChannelsStore();

  channels.add("general", false);
}

function initNotifications() {
  const notifications = useNotificationsStore();

  for (let i = 0; i < 10; i++) {
    notifications.add({
      channelId: 1,
      fromUser: "johndoe",
      content: `message test #${i}`,
      timestamp: new Date(),
    })
  }
}

export default defineBoot(() => {
  initCommands();
  initChannels();
  initNotifications();
});
