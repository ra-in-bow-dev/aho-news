// selective components import
import Framework7 from './f7.config'
import Framework7Svelte from 'framework7-svelte'
import App from './App.svelte'
// global styles
import './styles/framework7.config.less'
import './styles/global.css'

Framework7.use(Framework7Svelte)
const app = new App({ target: document.body })

export default app