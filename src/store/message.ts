import { derived, Readable, writable, Writable } from "svelte/store"

export interface Message {
  id: string // our code generated
  body: string // markdown code to render
  reply_to: string // other message id
  timestamp: number // on message dynamic stamp
  from: string // author peer id
}

export const editingMessage: Writable<string> = writable('')

export const messages: Writable<Map<string, Message>> = writable(new Map())

// all the messages in order
export const messagesOrdered: Readable<Array<Message>> = derived(
  [messages],
  ([$messages]): Message[] => 
    Array.from($messages.values())
      .sort( (a, b) => a.timestamp > b.timestamp? 1 : -1)
)
// sorted by timestamp and filtered by reply_to===null messages
export const threads: Readable<Array<Message>> = derived(
  [messagesOrdered],
  ([$messagesOrdered]) =>
    $messagesOrdered
      .filter((m) => !m.reply_to)
      .sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
)
