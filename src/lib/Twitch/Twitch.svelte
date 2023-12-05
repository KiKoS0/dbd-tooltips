<script context="module" lang="ts">
  import {
    perkStore,
    hudSize,
    appEnabled,
    showInfo,
    userData,
    addonStore,
    localizedSurvivorPerksData,
    localizedKillerPerksData
  } from '../Stores/globals'
  import { locale, type Locale } from '../I18n'

  import { getRandom, getTimeout, lessThanFourMinsAgo } from '../utils'
  import { emptyAddons, emptyPerks, fetchData, log } from './utils'
  import type {
    DbdLoadoutPayload,
    TwitchAuthPayload,
    TwitchExtensionContext
  } from './types'

  var twitch = window.Twitch.ext
  var token = ''
  var game = ''
  var commsEnabled = false
  var killSwitchOn = false
  let initialized = false
  let channelId = ''
  let lastUpdateTimestamp = 0
  let isFirstUpdate = true
  let infoAnimationDelay = 5000
  const cdnHost = import.meta.env?.VITE_CDN_HOST

  appEnabled.subscribe((val) => {
    commsEnabled = val
  })

  const apiEndpoint = `${import.meta.env.VITE_API_URL}/api/v1/`
  log(`EBS ENDPOINT: ${apiEndpoint}`)

  export const queryPerks = () =>
    (async () => {
      if (!channelId) return undefined
      const response = await fetch(apiEndpoint + 'pubsub/' + channelId, {
        mode: 'cors',
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + token,
          'X-KIK-LOAD': channelId
        }
      })
      const json = (await response.json()) as DbdLoadoutPayload

      // DEBUG ONLY
      // const response = { "actor": "killer", "channel": "246771012", "extra": { "addons": ["Treated_Blade", "Dried_Horsemeat"], "killer": "Knight" }, "perks": ["Scourge_Hook:_Pain_Resonance", "Call_of_Brine", "Corrupt_Intervention", "Nowhere_to_Hide"], "rdm": 60000, "ttl": 1669161098672, "ui_scale": "100" }
      // const response = { "actor": "survivor", "channel": "246771012", "extra": null, "perks": ["Adrenaline", "Dead_Hard", "Decisive_Strike", "Off_the_Record"], "rdm": 60000, "ttl": 1665350648100, "ui_scale": "100" }
      // const json = response
      return json
    })()

  export const refreshPerks = (
    method: () => Promise<DbdLoadoutPayload | undefined>,
    empty = true,
    doUpdate = false
  ) => {
    if (commsEnabled) {
      if (empty) {
        perkStore.update((_) => emptyPerks)
      }

      log('SENDING refresh request')
      method()
        .then((data) => {
          if (doUpdate) {
            updateApp(data)
          }
        })
        .catch((err) => {
          log('Update request failed.')
          log(err)
          // Reset state
          updateApp()
        })
    }
  }

  export const updateApp = (data?: DbdLoadoutPayload) => {
    log(data)

    if (data?.extra && data.actor == 'killer') {
      const killerId = data.extra.killer
      const addons = data.extra.addons.map((addonId) =>
        addonId ? { killerId, id: addonId } : null
      )

      addonStore.update(() => addons)
    } else {
      addonStore.update(() => emptyAddons)
    }
    if (data?.perks) {
      const perks = data.perks.map((perkId) =>
        perkId ? { actor: data.actor, id: perkId } : null
      )
      perkStore.update(() => perks)

      hudSize.update(() => data.ui_scale)
      if (isFirstUpdate) {
        isFirstUpdate = false
        showInfo.update((_) => true)
        setTimeout(() => showInfo.update((_) => false), infoAnimationDelay)
        // setTimeout(() => showPerk.update(_ => 1), 0); // DEBUG ONLY
      }
    } else {
      // Force empty
      perkStore.update((_) => emptyPerks)
    }

    if (data?.ttl) scheduleUpdate(data)
    lastUpdateTimestamp = Date.now()
  }

  let timer: ReturnType<typeof setTimeout>

  const scheduleUpdate = (data: DbdLoadoutPayload) => {
    log('data' + data)
    var diff = getTimeout(data.ttl)
    const rdm = getRandom(data.rdm)
    clearTimeout(timer)
    timer = setTimeout(() => refreshPerks(queryPerks, false), diff + rdm)
    log('Next call in ms: ' + diff + ' + ' + rdm)
  }

  const socketDispatch = (
    target: string,
    contentType: string,
    messagePayload: string
  ) => {
    log('-- Received broadcast --')
    log('target: ' + target)
    log('contentType: ' + contentType)
    const message = JSON.parse(messagePayload)
    log('message-type: ' + message.type)
    if (message.type === 'delay') {
      log('Got delay broadcast')
      const data = message.data
      scheduleUpdate(data)
    } else if (message.type === 'update') {
      // Update request
      const data = message.data
      updateApp(data)
    } else if (message.type === 'disable') {
      // KillSwitch
      killApp()
    }
  }

  // High load fail-safe
  const killApp = () => {
    log('BYE BYE.')
    killSwitchOn = true
    appEnabled.update((_) => false)
  }

  const onAuthorized = (auth: TwitchAuthPayload) => {
    if (!killSwitchOn) {
      token = auth.token
      channelId = auth.channelId
      userData.update(() => ({ token, channelId }))

      log('onAuthorized')
      log('Token: ' + token)
      log('Location: ' + window.location)
      log(`CHANNELID: ${channelId}`)

      if (!initialized) {
        refreshPerks(queryPerks, true, true)
        initialized = true
      }
    }
  }

  const onVisibilityChanged = (isVisible: boolean) => {
    if (isVisible) {
      log('Visiblity on.')
    } else {
      log('Visiblity off. Disabling app.')
      appEnabled.update((_) => false)
    }
  }

  const onContext = (context: TwitchExtensionContext) => {
    log('context:')
    log(context)
    game = context.game

    const gameName = 'Dead by Daylight'
    const gameIsDBD = game === gameName || import.meta.env.DEV
    const configMode = context.mode === 'config'

    if (commsEnabled) {
      if (!gameIsDBD) {
        log('Disabling app, game is not dbd')
        appEnabled.update((_) => false)
      }
    } else if (gameIsDBD && !configMode) {
      appEnabled.update((_) => true)
      commsEnabled = true
      if (token && !lessThanFourMinsAgo(lastUpdateTimestamp)) {
        // The app never calls home when not visible,
        // but it will update its state if it receives
        // broadcast messages from Twitch pubsub.
        // In case the app did not receive any messages for
        // too long this should call the EBS to get the last state.
        refreshPerks(queryPerks, true, true)
        initialized = true
      }
    }
  }

  export const getConfig = () =>
    (async () => {
      const response = await fetch(apiEndpoint + 'channels/config', {
        mode: 'cors',
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      const channelPerks = await response.json()
      return channelPerks
    })()

  export const postConfig = (data: unknown) =>
    (async () => {
      const response = await fetch(apiEndpoint + 'channels/config', {
        mode: 'cors',
        method: 'post',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const channelPerks = await response.json()
      return channelPerks
    })()

  export const updateAppLocale = async (requestedLocale: Locale) => {
    const response = await fetch(`https://${cdnHost}/supported_locales.json`)
    let data = (await response.json()) as string[]

    const lang = data.includes(requestedLocale) ? requestedLocale : 'en'
    initLocale(lang)
  }

  const initLocale = (lang: Locale) => {
    locale.update(() => lang)
    if (lang !== 'en') {
      fetchData(
        `locales/survivors_${lang}.json`,
        localizedSurvivorPerksData.update
      )
      fetchData(`locales/killers_${lang}.json`, localizedKillerPerksData.update)
    } else {
      localizedSurvivorPerksData.update(() => ({}))
      localizedKillerPerksData.update(() => ({}))
    }
  }

  const urlParams = new URLSearchParams(window.location.search)
  updateAppLocale((urlParams.get('language') || 'en') as Locale)
</script>

<script lang="ts">
  import { onMount } from 'svelte'

  onMount(() => {
    // Register Twitch callbacks
    twitch.listen('broadcast', socketDispatch)
    twitch.onAuthorized(onAuthorized)
    twitch.onVisibilityChanged(onVisibilityChanged)
    twitch.onContext(onContext)
  })
</script>
