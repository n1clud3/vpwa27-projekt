import { defineBoot } from '#q-app';
import { useCommandsStore } from '@/stores/commands';
import { useChannelsStore } from '@/stores/channels';
import { errorMessage } from '@/api/client';
import type { Command } from '@/types/commands';
import { useQuasar } from 'quasar';

export default defineBoot(({ router }) => {
  const commands = useCommandsStore();
  const channels = useChannelsStore();
  const $q = useQuasar();

  const cmds: Command[] = [
    {
      name: 'join',
      availableOutOfChannel: true,
      description: 'Join a channel',
      params: [
        { name: 'channel_name', mandatory: true },
        { name: 'private', mandatory: false },
      ],
      callback: (args) => {
        if (args.length > 2) {
          $q.notify('/join: the amount of parameters exceeds possible input.');
          return;
        }

        const name = args[0];
        if (!name) {
          $q.notify('/join: channel_name is required.');
          return;
        }
        const isPrivate = args[1] === 'private';

        void channels
          .join(name, isPrivate)
          .then((channel) => router.push(`/chat/${channel.id}`))
          .catch((e: unknown) => $q.notify({ type: 'negative', message: errorMessage(e) }));
      },
    },
  ];

  for (const cmd of cmds) commands.add(cmd);
});
