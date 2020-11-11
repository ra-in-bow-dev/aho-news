import Framework7 from './framework7.config'
import Framework7Svelte from 'framework7-svelte'
import './framework7.config.less'
import App from './App.svelte'

Framework7.use(Framework7Svelte)
const app = new App({ target: document.body })

export default app