<script lang="ts">
  import { userDataStore } from '../Stores/UserStore.svelte'
  import { getConfig, postConfig } from '../Twitch'

  let { initialized, isUnavailable, isLoading, configEnabledByEBS } = $props<{
    initialized?: boolean
    isUnavailable?: boolean
    isLoading?: boolean
    configEnabledByEBS?: boolean
  }>()

  let scale: number | undefined = undefined
  let savedConfig = false

  const userState = userDataStore()

  $effect(() => {
    if (userState.userData && !initialized) {
      getConfig()
        .then((data) => {
          console.log(`Configuration: ${JSON.stringify(data)}`)
          initialized = true
          isLoading = false
          configEnabledByEBS = data.globalConfigEnabled
          scale = data.uiScale
        })
        .catch(() => {
          isLoading = false
          isUnavailable = true
        })
    }
  })

  function submitConfig() {
    savedConfig = false
    postConfig({ ui_scale: scale }).then((res) => {
      console.log('Successfully sent')
      savedConfig = true
    })
  }
</script>

<div class="config-container">
  <div class="config-content">
    <div class="status-message">
      {#if isLoading}
        <p>Loading configuration ...</p>
      {:else if isUnavailable}
        <p>Configuration is unavailable.</p>
        <p>
          Please try again later or contact us at
          <a href="mailto:contact@dbdtwitch.com">contact@dbdtwitch.com</a> if it
          persists.
        </p>
      {:else if initialized}
        {#if !configEnabledByEBS}<p>
            No configuration is needed right now. You are good to go.
          </p>
        {:else}
          <p>Unimplemented</p>
        {/if}
      {/if}
    </div>
  </div>
</div>

<style>
  .config-content {
    width: 60%;
    background: #0e0e10;
    border-radius: 5px;
    padding: 20px;
    min-height: 400px;
  }
  .status-message {
    text-align: center;
  }
  .config-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: white;
    background-color: rgb(24, 24, 27);
  }
</style>
