<script context="module" lang="ts">
  import { getRandom, getTimeout, lessThanFourMinsAgo } from '../utils.svelte'
  import { API_ENDPOINT, EMPTY_ADDONS, EMPTY_PERKS } from './utils'
  import { appStateStore } from '../Stores/AppStateStore.svelte'
  import { currentGameStateStore } from '../Stores/CurrentGameStateStore.svelte'
  import { visualStore } from '../Stores/VisualStore.svelte'
  import { userDataStore } from '../Stores/UserStore.svelte'
  import type {
    DbdLoadoutPayload,
    TwitchAuthPayload,
    TwitchExtensionContext
  } from './types'

  const appEnabled = appStateStore()
  const currentGameState = currentGameStateStore()
  const visualState = visualStore()
  const userState = userDataStore()

  let twitch = window.Twitch.ext
  let token = ''
  let game = ''
  let killSwitchOn = false
  let initialized = false
  let channelId = ''
  let lastUpdateTimestamp = 0
  let isFirstUpdate = true

  const apiEndpoint = `${import.meta.env.VITE_API_URL}/api/v1/`
  console.log(`EBS ENDPOINT: ${apiEndpoint}`)

  export const queryPerks = () =>
    (async () => {
      if (!channelId) return undefined
      // const response = await fetch(apiEndpoint + 'pubsub/' + channelId, {
      //   mode: 'cors',
      //   method: 'get',
      //   headers: {
      //     Authorization: 'Bearer ' + token,
      //     'X-KIK-LOAD': channelId
      //   }
      // })
      // const json = (await response.json()) as DbdLoadoutPayload

      // DEBUG ONLY
      const response = {
        actor: 'killer',
        channel: '246771012',
        extra: {
          addons: ['Treated_Blade', 'Dried_Horsemeat'],
          killer: 'Knight'
        },
        perks: [
          'Scourge_Hook:_Pain_Resonance',
          'Call_of_Brine',
          'Corrupt_Intervention',
          'Nowhere_to_Hide'
        ],
        rdm: 60000,
        ttl: 1669161098672,
        ui_scale: '100'
      }
      // const response = { "actor": "survivor", "channel": "246771012", "extra": null, "perks": ["Adrenaline", "Dead_Hard", "Decisive_Strike", "Off_the_Record"], "rdm": 60000, "ttl": 1665350648100, "ui_scale": "100" }
      const json = response
      return json as DbdLoadoutPayload
    })()

  export const refreshPerks = (
    method: () => Promise<DbdLoadoutPayload | undefined>,
    empty = true,
    doUpdate = false
  ) => {
    if (appEnabled.enabled) {
      if (empty) {
        currentGameState.setPerks(EMPTY_PERKS)
      }

      console.log('SENDING refresh request')
      method()
        .then((data) => {
          if (doUpdate) {
            updateApp(data)
          }
        })
        .catch((err) => {
          console.log('Update request failed.')
          console.log(err)
          // Reset state
          updateApp()
        })
    }
  }

  export const updateApp = (data?: DbdLoadoutPayload) => {
    console.log(data)

    if (data?.extra && data.actor == 'killer') {
      const killerId = data.extra.killer
      const addons = data.extra.addons.map((addonId) =>
        addonId ? { killerId, id: addonId } : null
      )

      currentGameState.setAddons(addons)
    } else {
      currentGameState.setAddons(EMPTY_ADDONS)
    }
    if (data?.perks) {
      const perks = data.perks.map((perkId) =>
        perkId ? { actor: data.actor, id: perkId } : null
      )

      currentGameState.setPerks(perks)
      currentGameState.setHudSize(data.ui_scale)

      if (isFirstUpdate) {
        isFirstUpdate = false
        visualState.showHelperInfo()
      }
    } else {
      currentGameState.setPerks(EMPTY_PERKS)
    }

    if (data?.ttl) scheduleUpdate(data)
    lastUpdateTimestamp = Date.now()
  }

  let timer: ReturnType<typeof setTimeout>

  const scheduleUpdate = (data: DbdLoadoutPayload) => {
    console.log('data' + data)
    var diff = getTimeout(data.ttl)
    const rdm = getRandom(data.rdm)
    clearTimeout(timer)
    timer = setTimeout(() => refreshPerks(queryPerks, false), diff + rdm)
    console.log('Next call in ms: ' + diff + ' + ' + rdm)
  }

  const socketDispatch = (
    target: string,
    contentType: string,
    messagePayload: string
  ) => {
    console.log('-- Received broadcast --')
    console.log('target: ' + target)
    console.log('contentType: ' + contentType)
    const message = JSON.parse(messagePayload)
    console.log('message-type: ' + message.type)

    switch (message.type) {
      case 'delay':
        console.log('Got delay broadcast')
        scheduleUpdate(message.data)
        break
      case 'update':
        updateApp(message.data)
        break
      case 'disable':
        killApp()
        break
    }
  }

  // High load fail-safe
  const killApp = () => {
    console.log('BYE BYE.')
    killSwitchOn = true
    appEnabled.disable()
  }

  const onAuthorized = (auth: TwitchAuthPayload) => {
    if (!killSwitchOn) {
      token = auth.token
      channelId = auth.channelId
      userState.setUserData({ token, channelId, userId: auth.userId })

      console.log('onAuthorized')
      console.log('Token: ' + token)
      console.log('Location: ' + window.location)
      console.log(`CHANNELID: ${channelId}`)

      if (!initialized) {
        refreshPerks(queryPerks, true, true)
        initialized = true
      }
    }
  }

  const onVisibilityChanged = (isVisible: boolean) => {
    if (isVisible) {
      console.log('Visiblity on.')
    } else {
      console.log('Visiblity off. Disabling app.')
      appEnabled.disable()
    }
  }

  const onContext = (context: TwitchExtensionContext) => {
    game = context.game

    const gameName = 'Dead by Daylight'
    const gameIsDBD = game === gameName || import.meta.env.DEV
    const configMode = context.mode === 'config'

    if (appEnabled.enabled) {
      if (!gameIsDBD) {
        console.log('Disabling app, game is not dbd')
        appEnabled.disable()
      }
    } else if (gameIsDBD && !configMode) {
      appEnabled.enable()
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
      const response = await fetch(API_ENDPOINT + 'channels/config', {
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
      const response = await fetch(API_ENDPOINT + 'channels/config', {
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
