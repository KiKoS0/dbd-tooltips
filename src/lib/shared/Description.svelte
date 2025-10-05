<script lang="ts">
  import { visualStore } from '../Stores/VisualStore.svelte'

  let {
    description = '',
    changelogs,
    mobileMode = false
  } = $props<{
    description?: string
    changelogs?: string
    mobileMode?: boolean
  }>()

  let containerRef: HTMLDivElement | undefined
  let descriptionContentHeight = $state(0)

  const HEIGHT_THRESHOLD = 450

  let showChangelogs = $derived(visualStore().changelogsShowing)
  let shouldShowToggle = $derived(
    !!changelogs || descriptionContentHeight > HEIGHT_THRESHOLD
  )

  const cdnHost = import.meta.env?.VITE_CDN_HOST

  const getWikiUrl = (link: string) => {
    if (link.startsWith('http://') || link.startsWith('https://')) {
      return link
    }
    return `https://deadbydaylight.wiki.gg/${link}`
  }

  const fixLinks = () => {
    if (description || changelogs) {
      const links = containerRef?.getElementsByTagName('a') || []
      Array.from(links).forEach((l) => {
        const href = l.getAttribute('href')
        if (href) {
          l.href = getWikiUrl(href)
          l.target = '_blank'
          l.rel = 'noopener noreferrer'
          l.classList.add('wiki-link')
        }
      })

      console.debug(`Fixed links: ${links.length}`)
    }
  }

  const redirectIconSrcsToCDN = () => {
    if (description || changelogs) {
      const icons = containerRef?.getElementsByTagName('img') || []

      Array.from(icons).forEach((icon) => {
        const iconSrc = icon.src

        const match = /images\/icons\/.*/.exec(iconSrc)
        const notGoingToCDNAlready = !iconSrc.includes(cdnHost)

        if (match && notGoingToCDNAlready) {
          icon.src = `https://${cdnHost}/${match[0]}`
        }
      })
      console.debug(`Updated icons: ${icons.length}`)
    }
  }

  $effect(() => {
    redirectIconSrcsToCDN()
    fixLinks()

    if (containerRef) {
      descriptionContentHeight = containerRef.scrollHeight
    }
  })

  $effect(() => {
    // Reset changelog state when description or changelogs change (hover change)
    void description
    void changelogs
    visualStore().hideChangelogs()
  })
</script>

<div
  bind:this={containerRef}
  class="description_container"
  style="--height-threshold: {HEIGHT_THRESHOLD}px"
>
  <div
    class:content-container={shouldShowToggle && !showChangelogs && !mobileMode}
    class:content-container-expanded={shouldShowToggle &&
      showChangelogs &&
      !mobileMode}
  >
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html description}

    {#if shouldShowToggle && changelogs}
      <hr
        class="new-hr"
        class:hr-hidden={!showChangelogs && !mobileMode}
        style="opacity:0.1"
      />
      {#if changelogs}
        <div
          class="new-changelogs-container"
          class:changelog-content-hidden={!showChangelogs && !mobileMode}
          data-testid="description.changelogs"
        >
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html changelogs}
        </div>
      {/if}
    {/if}
  </div>

  {#if shouldShowToggle}
    <div class="changelog-toggle-container">
      <div
        class="changelog-arrow"
        onclick={(e) => {
          e.stopPropagation()
          visualStore().toggleChangelogs()
        }}
        role="button"
        tabindex="0"
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation()
            visualStore().toggleChangelogs()
          }
        }}
        title={showChangelogs ? 'Collapse changelog' : 'Expand changelog'}
      >
        {showChangelogs ? '▲' : '▼'}
      </div>
      <a
        href="https://ko-fi.com/kikos"
        target="_blank"
        rel="noopener noreferrer"
        class="support-button"
        onclick={(e) => e.stopPropagation()}
        title="Support us"
      >
        <img src="/images/heart-regular-full.svg" alt="Support" />
      </a>
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
    max-height: 100px;
    transition:
      opacity 0.35s ease-in-out,
      max-height 0.35s ease-in-out;
  }
  .hr-hidden {
    opacity: 0 !important;
    max-height: 0;
    overflow: hidden;
  }
  :global(p) {
    margin-block-end: 0.5em;
    margin-block-start: 0.5em;
  }
  :global(ul) {
    margin-block-end: 0.5em;
    margin-block-start: 0.5em;
  }

  .description_container {
    font-size: 1.17rem;
    font-family: 'Inter', sans-serif;
  }

  :global(.description_container .wiki-link) {
    color: #b8a080;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  :global(.description_container .wiki-link:hover) {
    color: #e7cda2;
  }

  :global(.description_container .mw-headline a) {
    color: #777777 !important;
    transition: color 0.2s ease;
  }

  :global(.description_container .mw-headline a:hover) {
    color: #e7cda2 !important;
  }

  .content-container {
    max-height: var(--height-threshold);
    overflow: hidden;
    transition: max-height 0.35s ease-in-out;
  }
  .content-container-expanded {
    max-height: 2000px;
    transition: max-height 0.35s ease-in-out;
    overflow: hidden;
  }

  .new-changelogs-container {
    overflow: hidden;
    max-height: 2000px;
    transition: max-height 0.35s ease-in-out;
  }

  .changelog-content-hidden {
    max-height: 0;
    transition: max-height 0.35s ease-in-out;
  }

  .changelog-toggle-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-top: 16px;
  }

  .changelog-arrow {
    display: inline-block;
    cursor: pointer;
    color: #e7cda2;
    font-size: 1.2rem;
    padding: 6px 12px;
    background-color: #1a1520;
    border: 2px solid #e7cda2;
    border-radius: 4px;
    transition:
      color 0.2s ease,
      border-color 0.2s ease,
      background-color 0.2s ease;
    user-select: none;
  }

  .changelog-arrow:hover {
    color: #f0d9b0;
    border-color: #f0d9b0;
    background-color: #252030;
  }

  .support-button {
    position: absolute;
    right: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .support-button:hover {
    opacity: 0.8;
  }

  .support-button img {
    width: 24px;
    height: 24px;
    filter: brightness(0) saturate(100%) invert(83%) sepia(14%) saturate(1064%)
      hue-rotate(358deg) brightness(96%) contrast(85%);
  }

  .support-button:hover img {
    filter: brightness(0) saturate(100%) invert(92%) sepia(8%) saturate(1133%)
      hue-rotate(334deg) brightness(101%) contrast(87%);
  }
</style>
