export interface Notification {
  channelId: number,
  fromUser: string,
  content: string,
  timestamp: Date | string | number,
}
