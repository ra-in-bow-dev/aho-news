import { hash } from 'spark-md5'

export default (ss: string[]): string =>
  hash(ss.join('') + Math.random().toString())
