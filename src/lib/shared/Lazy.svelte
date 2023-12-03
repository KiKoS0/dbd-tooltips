<script lang="ts">
  import { onMount, type ComponentType } from 'svelte'

  type Module = { default: ComponentType }

  export let component: () => Promise<Module>
  export let delayMs: number | null = null

  let loadedComponent: ComponentType
  let timeout: ReturnType<typeof setTimeout>
  let showFallback = !delayMs

  let props: Record<string, unknown>
  $: {
    const { component, delayMs, ...restProps } = $$props
    props = restProps
  }

  onMount(() => {
    if (delayMs) {
      timeout = setTimeout(() => {
        showFallback = true
      }, delayMs)
    }
    component().then((module) => {
      loadedComponent = module.default
    })
    return () => clearTimeout(timeout)
  })
</script>

{#if loadedComponent}
  <svelte:component this={loadedComponent} {...props} />
{:else if showFallback}
  <slot />
{/if}
