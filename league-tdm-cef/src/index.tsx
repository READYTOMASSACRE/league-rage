import React from 'react'
import { createRoot } from 'react-dom/client'
import Chat from './components/chat'
import Scoreboard from './components/scoreboard/Scoreboard'
import './index.module.sass'

// status (dead/alive) more info for score
const teamInfo = [
  {
    id: 1,
    name: 'USA',
    role: 'attack',
    score: 3,
    color: 'purple',
  },
  {
    id: 2,
    name: 'CN',
    role: 'defense',
    score: 2,
    color: 'yellow',
  }
]


const playersInfo = [
  {
    id: 11,
    name: 'Player name #1',
    kills: 10,
    death: 5,
    assists: 7,
    ping: 33,
    role: teamInfo[0].role,
    team: 'USA',
    lvl: 777
  },
  {
    id: 12,
    name: 'Player name #2',
    kills: 14,
    death: 10,
    assists: 4,
    ping: 78,
    role: 'spectator',
    team: 'spectator',
    lvl: 777
  },
  {
    id: 13,
    name: 'Player name #3',
    kills: 4,
    death: 12,
    assists: 1,
    ping: 78,
    role: 'spectator',
    team: 'spectator',
    lvl: 777
  },
  {
    id: 14,
    name: 'Player name #4',
    kills: 2,
    death: 4,
    assists: 0,
    ping: 78,
    role: teamInfo[0].role,
    team: 'USA',
    lvl: 777
  },
  {
    id: 15,
    name: 'Player name #5',
    kills: 10,
    death: 3,
    assists: 12,
    ping: 53,
    role: teamInfo[0].role,
    team: 'USA',
    lvl: 777,
  },
  {
    id: 16,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: 'spectator',
    team: 'spectator',
    lvl: 777
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
    lvl: 777
  },
  {
    id: 18,
    name: 'Player name #8',
    kills: 999,
    death: 999,
    assists: 999,
    ping: 999,
    role: 'spectator',
    team: 'spectator',
    lvl: 777
  },
  {
    id: 16312,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: 'spectator',
    team: 'spectator',
    lvl: 777
  },
  {
    id: 1633211,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: 'spectator',
    team: 'spectator',
    lvl: 777
  },
  {
    id: 163425,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: 'spectator',
    team: 'spectator',
    lvl: 777
  },
  {
    id: 16765,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: 'spectator',
    team: 'spectator',
    lvl: 777
  },
  {
    id: 1765756,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: 'spectator',
    team: 'spectator',
    lvl: 777
  },
  {
    id: 153456,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 1213216,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 15426346,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 11233456446,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 42353453416,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 153454676,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 1534534636,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 14234256676,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 111116,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 122226,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 1333336,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 14443246,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 14234236,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 14324236,
    name: 'Player name #6hasdasdualsikd lashdlsahddhsaiodhsaod hasidhsaiodjhsaipodhasidhasiopdhasold hosahdas dhsaodhasdosah',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 14234222236,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 164234231,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 1643534346,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 1623523521,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 12352345236,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
  },
  {
    id: 152345235326,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777,
  },
  {
    id: 15235235236,
    name: 'Player name #6',
    kills: 5,
    death: 1,
    assists: 7,
    ping: 10,
    role: teamInfo[1].role,
    team: 'CN',
    lvl: 777
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
      <Chat />
    </>
  )
}

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <App/>
)