import type { MessageCache } from '../types/main.js'

/** 
 * @property {string}  replyMessageId  - The reply too the message
 * @property {string}  userMessageId   - The message from the run function
*/
export const messageCache = new Set<MessageCache>();

