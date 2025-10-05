import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Store original fetch
const originalFetch = global.fetch

// Mock fetch to disable analytics during tests
global.fetch = vi.fn((url, ...args) => {
  if (typeof url === 'string' && url.includes('feature_flags.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ 'enable-analytics': false })
    } as Response)
  }
  // Let all other fetches through
  return originalFetch(url, ...args)
})
