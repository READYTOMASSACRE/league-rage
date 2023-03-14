import React from 'react'
import { createRoot } from 'react-dom/client'
import Chat from './components/chat'
import TeamSelector from './components/teamselector'
import Popup from './components/popup/Popup'
import Scoreboard from './components/scoreboard/Scoreboard'
import './index.module.sass'
import WeaponSelector from './components/weaponselector/WeaponSelector'
import Infopanel from './components/infopanel'
import RageAPI from './helpers/RageAPI'
import Controls from './components/controls'

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
      {RageAPI.sendReady()}
    </>
  )
}

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <App/>
)