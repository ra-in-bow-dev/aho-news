import App from './App.svelte'

const app = new App({ 
    target: document.body,
    props: {
        seens: JSON.parse(localStorage.getItem('seens') || '[]'),
        settings: JSON.parse(localStorage.getItem('settings') || '{}')
    }
})

export default app
