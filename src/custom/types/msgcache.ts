export type MessageCache = {
  messageID: string
  replyID: string
}

export const messagesCache = new Set<MessageCache>()