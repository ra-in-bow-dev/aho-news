import { writable, Writable } from 'svelte/store'

const count: Writable<number> = writable(0)

const increaseCount = () => {
  count.update(state => {

    //Manipulate the state
    state += 1

    //Make sure to always return the updated state here!
    return state
  })
}

const decreaseCount = () => {
  count.update(state => {

    //Manipulate the state
    state -= 1

    //Make sure to always return the updated state here!
    return state
  })
}

const resetCount = () => {
  count.update(state => {
    //Manipulate the state
    state = 0

    //Make sure to always return the updated state here!
    return state
  })
}

export { count, increaseCount, decreaseCount, resetCount }