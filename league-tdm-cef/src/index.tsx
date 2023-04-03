import React from 'react'
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
<<<<<<< Updated upstream
import Motd from './components/motd/motd'
import Panel from './components/panel/panel'
import Spectate from './components/spectate/spectate'
import {Hud, Top, Center, Bottom, Absolute} from './components/hud/hud'
=======
>>>>>>> Stashed changes

const App = () => {
  return (
    <>
<<<<<<< Updated upstream
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
        </Center>
        <Bottom>
          <Popup />
          <Debug />
          <Spectate />
          <WeaponHud />
          <Controls />
        </Bottom>
        <Absolute>
          <Notifytext />
        </Absolute>
      </Hud>
=======
      <Scoreboard />
      <Chat />
      <Popup />
      <TeamSelector />
      <WeaponSelector />
      <Infopanel />
      <Controls />
      <Notifytext />
      <Debug />
      <DeathLog />
      <WeaponHud />
>>>>>>> Stashed changes
      {RageAPI.sendReady()}
    </>
  )
}

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <App/>
)   