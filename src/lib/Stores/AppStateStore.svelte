<script context="module" lang="ts">
  let appEnabled = $state(false)
  let isMobile = $state(false)
  let isConfig = $state(false)

  export const appStateStore = () => {
    return {
      get enabled() {
        return appEnabled
      },
      get isMobile() {
        return isMobile
      },
      get isConfig() {
        return isConfig
      },
      enable: () => (appEnabled = true),
      disable: () => (appEnabled = false),
      setAppMode: (mode: 'mobile' | 'config') => {
        if (mode === 'mobile') {
          isMobile = true
          isConfig = false
        } else {
          isMobile = false
          isConfig = true
        }
      }
    }
  }
</script>
