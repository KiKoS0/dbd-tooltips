<script lang="ts">
  import { afterUpdate } from 'svelte'
  import { t } from '../I18n'
  import { showChangelogs } from '../Stores/globals'
  import { log } from '../Twitch/utils'

  export let description = ''
  export let changelogs: string | undefined = undefined
  export let mobileMode = false

  let containerRef: HTMLDivElement | undefined

  const cdnHost = import.meta.env?.VITE_CDN_HOST

  const ignoreLinkClick = () => false

  const disableLinks = () => {
    const links = containerRef?.getElementsByTagName('a') || []

    Array.from(links).forEach((l) => {
      l.onclick = ignoreLinkClick
    })

    log(`Disabled links: ${links.length}`)
  }

  const redirectIconSrcsToCDN = () => {
    const icons = containerRef?.getElementsByTagName('img') || []

    Array.from(icons).forEach((icon) => {
      const iconSrc = icon.src

      const match = /images\/icons\/.*/.exec(iconSrc)
      const notGoingToCDNAlready = !iconSrc.includes(cdnHost)

      if (match && notGoingToCDNAlready) {
        icon.src = `https://${cdnHost}/${match[0]}`
      }
    })
    log(`Updated icons: ${icons.length}`)
  }

  afterUpdate(() => (redirectIconSrcsToCDN(), disableLinks()))
</script>

<div bind:this={containerRef} class="description_container">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html description}

  {#if changelogs}
    <div
      class:changelog-container={!$showChangelogs && !mobileMode}
      class:changelog-container-expanded={$showChangelogs && !mobileMode}
    >
      <hr class="new-hr" style="opacity:0.1" />
      {#if !$showChangelogs && !mobileMode}
        <h5 class="changelog-info">{$t('show.more')}</h5>
      {:else}
        <div class="new-changelogs-container">
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html changelogs}
          <hr class="new-hr" style="opacity:0.1" />
          <div class="wiki-info">
            {$t('show.wikiInfo')} <span>Dead by Daylight Wiki</span>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  :global(.description_container .changelogs) {
    display: none;
  }

  :global(.description_container hr) {
    display: none;
  }
  :global(.description_container .new-hr) {
    display: block;
  }
  :global(p) {
    margin-block-end: 0.5em;
    margin-block-start: 0.5em;
  }
  :global(ul) {
    margin-block-end: 0.5em;
    margin-block-start: 0.5em;
  }

  .wiki-info {
    font:
      italic 400 1.17rem 'Inter',
      sans-serif;
    text-align: center;
  }
  .wiki-info span {
    font:
      italic 500 1.17rem 'Inter',
      sans-serif;
  }

  .description_container {
    font-size: 1.17rem;
    font-family: 'Inter', sans-serif;
  }

  .changelog-info {
    text-align: center;
    margin: 0;
    margin-top: 16px;
    color: #e7cda2;
    font-size: 1.15rem;
  }

  .changelog-container {
    max-height: 60px;
    overflow: hidden;
  }
  .changelog-container-expanded {
    max-height: 1000px;
    transition: max-height 0.5s ease-in;
    overflow: hidden;
  }
</style>
