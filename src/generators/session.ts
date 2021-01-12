import generateUserpic from '../generators/userpic'
import generateUsername from '../generators/username'

// any user has session
export interface Session {
    peerId: string
    timestamp: number
    swarm: string
    username: string
    userpic: string
  }

export default async function (
    peerId: string,
    swarm: string,
    username?: string): Promise<Session> {
    return <Session>{
        peerId,
        swarm,
        timestamp: Date.now(),
        username: username || await generateUsername(),
        userpic: await generateUserpic()
    }
}