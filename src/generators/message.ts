import type { Message } from '../store/message'
import generateId from './uid'

const generateMessageId = (m: Message): string =>
  generateId([m.from, m.timestamp.toString(), m.body, 'ahomsg'])

// currently test purposes only
export default (): Message => {
  let m: Message
  m.from = 'change-me-fake-peer-id'
  m.body = 'change me: test message body, buddy'
  m.timestamp = Date.now()
  m.id = generateMessageId(m)
  return m
}
