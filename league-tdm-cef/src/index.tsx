import React from 'react'
import { createRoot } from 'react-dom/client'
import Scoreboard from './components/scoreboard/Scoreboard'
import './index.sass'

// status (dead/alive) more info for score

const playersInfo = [
  {
    id: 11,
    name: 'Player name #1',
    kills: 10,
    death: 5,
    assists: 7,
    ping: 33,
    role: 'attack',
    team: 'USA',
  },
  {
    id: 12,
    name: 'Player name #2',
    kills: 14,
    death: 10,
    assists: 4,
    ping: 78,
    role: 'defense',
    team: 'CN',
  },
  {
    id: 13,
    name: 'Player name #3',
    kills: 4,
    death: 12,
    assists: 1,
    ping: 78,
    role: 'defense',
    team: 'CN',
  },
  {
    id: 14,
    name: 'Player name #4',
    kills: 2,
    death: 4,
    assists: 0,
    ping: 78,
    role: 'attack',
    team: 'USA',
  },
  {
    id: 15,
    name: 'Player name #5',
    kills: 10,
    death: 3,
    assists: 12,
    ping: 53,
    role: 'attack',
    team: 'USA',
  },
  {
    id: 16,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: 'defense',
    team: 'CN',
  },
  {
    id: 17,
    name: 'Player name #7',
    kills: 0,
    death: 0,
    assists: 0,
    ping: 11,
    role: 'spectator',
    team: 'spectator',
  },
  {
    id: 18,
    name: 'Player name #8',
    kills: 999,
    death: 999,
    assists: 999,
    ping: 999,
    role: 'defense',
    team: 'CN',
  },
]

const teamInfo = [
  {
    id: 1,
    name: 'USA',
    role: 'attack',
    score: 3,
  },
  {
    id: 2,
    name: 'CN',
    role: 'defense',
    score: 2,
  }
]

const currentPlayerInfo = {
  id: 15,
}

// add open/close on TAB
const App = () => {
  return (
    <>
      <Scoreboard currentPlayerId={currentPlayerInfo} teams={teamInfo} players={playersInfo}/>
    </>
  )
}

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <App/>
)