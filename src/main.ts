import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

import {
  init,
  browserTracingIntegration,
  browserProfilingIntegration
} from '@sentry/svelte'

init({
  dsn: 'https://cf4e5e31d67efd3fee13291158e779c6@o963300.ingest.sentry.io/4506361992314880',
  integrations: [browserTracingIntegration(), browserProfilingIntegration()],
  tracePropagationTargets: ['localhost', /^https:\/\/api\.dbdtwitch\.com\/api/],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0
})

const app = mount(App, { target: document.getElementById('app')! })
export default app
