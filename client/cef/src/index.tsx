import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import './index.module.sass'

import RageAPI from './helpers/RageAPI'

import Chat from './components/chat/chat'
import TeamSelector from './components/teamselector'
import Popup from './components/popup/popup'
import Scoreboard from './components/scoreboard/Scoreboard'
import WeaponSelector from './components/weaponselector/WeaponSelector'
import Infopanel from './components/infopanel/infopanel'
import Controls from './components/controls'
import Notifytext from './components/notifytext/notifytext'
import Debug from './components/debug'
import DeathLog from './components/deathlog/DeathLog'
import WeaponHud from './components/weaponhud/WeaponHud'
import Motd from './components/motd/motd'
import Panel from './components/panel/panel'
import Spectate from './components/spectate/spectate'
import {Hud, Top, Center, Bottom, Absolute} from './components/hud/hud'
import Winner from './components/winner/winner'
import Effects from './components/effects/effects'
import Gamemode from './components/gamemode/gamemode'
import { Events } from '../../../core/src/types'
import cefLog from './helpers/cefLog'

const App = () => {
  useEffect(() => {
    RageAPI.subscribe(Events["tdm.language"], 'app', (lang: string) => {
      try {
        if (!lang || typeof lang !== 'string') {
          return
        }
  
        RageAPI.lang.change(JSON.parse(lang))

      } catch (err) {
        cefLog(err)
      }
    })

    RageAPI.sendReady()

    return () => RageAPI.unsubscribe(Events['tdm.language'], 'app')
  }, [])

  return (
    <>
      <Hud>
        <Top>
          <Infopanel />
          <Chat />
          <DeathLog />
        </Top>
        <Center>
          <Scoreboard />
          <TeamSelector />
          <WeaponSelector />
          <Panel />
          <Motd />
          <Winner />
        </Center>
        <Bottom>
          <Popup />
          <Debug />
          <Spectate />
          <WeaponHud />
          <Controls />
          <Gamemode />
        </Bottom>
        <Absolute>
          <Notifytext />
          <Effects />
        </Absolute>
      </Hud>
    </>
  )
}

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <App/>
)   