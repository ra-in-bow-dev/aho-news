export interface Message {
    id: string // our code generated
    type: string // can be: image audio video text fix aho rate
    body: string // code to inject
    reply_to: string // other message id
    timestamp: number // on message dynamic stamp
    from: string // author peer id
  }