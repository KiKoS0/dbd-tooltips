import type { TwitchAuthPayload } from './types'

declare global {
  interface Window {
    Twitch: {
      ext: {
        listen: (
          target: string,
          callback: (
            target: string,
            contentType: string,
            message: string
          ) => void
        ) => void
        onAuthorized: (callback: (auth: TwitchAuthPayload) => void) => void
        onContext: (callback: (context: TwitchExtensionContext) => void) => void
        onVisibilityChanged: (
          callback: (
            isVisible: boolean,
            context: TwitchExtensionContext
          ) => void
        ) => void
      }
    }
  }
}
