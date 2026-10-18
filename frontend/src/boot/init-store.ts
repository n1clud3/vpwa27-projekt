import { defineBoot } from '#q-app';
import { useCommandsStore } from '@/stores/commands';

export default defineBoot(({router}) => {
  console.log('boot running')
  router.beforeEach((to, from) => {
    console.log('nav', from.path, '->', to.path)
  })

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
});
