import React from 'react'
import { createRoot } from 'react-dom/client'

import './index.module.sass'

import RageAPI from './helpers/RageAPI'

import Chat from './components/chat'
import TeamSelector from './components/teamselector'
import Popup from './components/popup/Popup'
import Scoreboard from './components/scoreboard/Scoreboard'
import WeaponSelector from './components/weaponselector/WeaponSelector'
import Infopanel from './components/infopanel'
import Controls from './components/controls'
import Notifytext from './components/notifytext'
import Debug from './components/debug'
import DeathLog from './components/deathlog/DeathLog'
import WeaponHud from './components/weaponhud/WeaponHud'
import Motd from './components/motd/motd'

const App = () => {

  return (
    <>
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
      <Motd />
      {RageAPI.sendReady()}
    </>
  )
}

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <App/>
)   