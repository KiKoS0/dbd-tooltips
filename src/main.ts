import './app.css'
import App from './App.svelte'

import { init } from '@sentry/svelte'

init({
  dsn: 'https://cf4e5e31d67efd3fee13291158e779c6@o963300.ingest.sentry.io/4506361992314880',
  integrations: []
})

const app = new App({ target: document.getElementById('app') as HTMLElement })

export default app
