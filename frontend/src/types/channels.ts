export interface Channel {
  name: string;
  isPublic: boolean;
}

export type ChannelList = Record<number, Channel>;
