<script context="module" lang="ts">
  let appEnabled = $state(false)

  export const appEnabledStore = () => {
    return {
      get value() {
        return appEnabled
      },
      enable: () => (appEnabled = true),
      disable: () => (appEnabled = false)
    }
  }
</script>
