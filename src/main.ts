import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

import {
  init,
  browserTracingIntegration,
  browserProfilingIntegration
} from '@sentry/svelte'

const tracesSampleRate = import.meta.env.MODE === 'development' ? 1 : 0.1
const profilesSampleRate = import.meta.env.MODE === 'development' ? 1 : 0.1

init({
  dsn: 'https://cf4e5e31d67efd3fee13291158e779c6@o963300.ingest.sentry.io/4506361992314880',
  integrations: [browserTracingIntegration(), browserProfilingIntegration()],
  tracesSampleRate,
  profilesSampleRate,
  environment: import.meta.env.MODE
})

const app = mount(App, { target: document.getElementById('app')! })
export default app
