import React, { FC, useEffect, useMemo, useRef, useState } from 'react'

import * as s from './Scoreboard.module.sass'
import cl from 'classnames'

import ListOfPlayers from './ListOfPlayer/ListOfPlayers'
import PlayerItem from './PlayerItem/PlayerItem'
import TeamBar from './TeamBar/TeamBar'
import HeaderScoreboard from './HeaderScoreboard/HeaderScoreboard'
import TeamItem from './Teamitem/TeamItem'
import Footer from './Footer/Footer'

import useFilterTeamBySide from '../../hooks/useFilterTeamBySide'
import useFilterPlayersBySide from '../../hooks/useFilterPlayersBySide'

import { Events, scoreboard, tdm } from '../../../../league-core/src/types'
import cefLog from '../../helpers/cefLog'
import RageAPI from '../../helpers/RageAPI'

const Scoreboard: FC = () => {

  const [active, setActive] = useState(false)
  const [[sortScoreboard, desSortScorboard], setSortScoreboard] = useState<[string, boolean]>(['kills', true])

  const [players, setPlayers] = useState<scoreboard.Player[]>([])
  const [teams, setTeams] = useState<scoreboard.Team[]>([])

  const scoreboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.scoreboard.toggle'], 'scoreboard', (a: boolean) => setActive(a))
    RageAPI.subscribe(Events['tdm.scoreboard.data'], 'scoreboard', (data: string) => {
      try {
        const { players, teams } = JSON.parse(data)

        if (typeof players !== 'undefined' && Array.isArray(players)) {
          setPlayers(players)
        }
        if (typeof teams !== 'undefined' && Array.isArray(teams)) {
          setTeams(teams)
        }
      } catch (err) {
        cefLog(err)
      }
    })

    return () => {
      RageAPI.unsubscribe(Events['tdm.scoreboard.toggle'], 'scoreboard')
      RageAPI.unsubscribe(Events['tdm.scoreboard.data'], 'scoreboard')
    }
  }, [])

  const currentPlayer = players.find(player => player.current)

  const sortedPlayers = useMemo(() => {
    const sortedPlayers = {
      kills: players.slice().sort((a, b) => desSortScorboard ? b.kills - a.kills : a.kills - b.kills),
      assists: players.slice().sort((a, b) => desSortScorboard ? b.assists - a.assists : a.assists - b.assists),
      death: players.slice().sort((a, b) => desSortScorboard ? b.death - a.death : a.death - b.death),
      name: players.slice().sort((a, b) => desSortScorboard ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)),
    }
    return sortedPlayers[sortScoreboard] ? sortedPlayers[sortScoreboard] : sortedPlayers.death
  }, [players, sortScoreboard, desSortScorboard])

  const attackPlayers = useFilterPlayersBySide(sortedPlayers, tdm.Team.attackers)
  const defensePlayers = useFilterPlayersBySide(sortedPlayers, tdm.Team.defenders)
  const spectatorPlayers = useFilterPlayersBySide(sortedPlayers, tdm.Team.spectators)
  const attackTeam = useFilterTeamBySide(teams, tdm.Team.attackers)
  const defenseTeam = useFilterTeamBySide(teams, tdm.Team.defenders)

  const changeSort = (type: string) => {
    type === sortScoreboard ?
      setSortScoreboard([sortScoreboard, !desSortScorboard]) :
      setSortScoreboard([type, true])
  }

  if (!active) return <></>

  return (
    <div ref={scoreboardRef} className={cl(s.scoreboard)}>
      <HeaderScoreboard attackTeam={attackTeam} defenseTeam={defenseTeam}/>
      <TeamItem side={'left'}>
        <TeamBar changeSort={changeSort} color={attackTeam?.color} />
        <ListOfPlayers>
          {attackPlayers && attackPlayers.map((player, index) =>
            <PlayerItem
              key={player.id}
              player={player}
              currentPlayer={currentPlayer?.id === player.id ? true : false} position={index + 1}
            />
          )}
        </ListOfPlayers>
      </TeamItem>
      <TeamItem side={'right'}>
        <TeamBar changeSort={changeSort} color={defenseTeam?.color} />
        <ListOfPlayers>
          {defensePlayers && defensePlayers.map((player, index) =>
            <PlayerItem
              key={player.id}
              player={player}
              currentPlayer={currentPlayer?.id === player.id ? true : false} position={index + 1}
            />
          )}
        </ListOfPlayers>
      </TeamItem>
      <Footer spectators={spectatorPlayers} />
    </div>
  )
}

export default Scoreboard;