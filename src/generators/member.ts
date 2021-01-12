import type { Member } from '../store/room'
import { getDarkColor } from './color'

export default (
  peerId: string,
  username: string,
  me?: boolean,
  media?: MediaStream
): Member => {
  const member: Member = <Member>{}
  member.stream = media
  // TODO: add his tracks to peer
  member.username = username
  member.peer = peerId
  member.speaking = false
  member.me = me
  member.dice = Math.random()
  member.color = getDarkColor()
  console.log('member: created one')
  //console.debug(member)
  return member
}
