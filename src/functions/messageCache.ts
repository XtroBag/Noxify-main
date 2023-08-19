import type { MessageCache } from '../types/typings.js'

/** 
 * @property {string}  replyMessageID  - The reply too the message
 * @property {string}  messageID   - The message from the run function
*/
export const cache = new Set<MessageCache>();

