import React, { FC, useEffect, useMemo, useState } from 'react'
import s from './Scoreboard.module.sass'
import cl from 'classnames'
import ListOfPlayers from './ListOfPlayer/ListOfPlayers'
import PlayerItem from './PlayerItem/PlayerItem'
import TeamBar from './TeamBar/TeamBar'
import { ICurrentPlayer, IPlayers, ITeams } from '../../types'
import HeaderScoreboard from './HeaderScoreboard/HeaderScoreboard'
import TeamItem from './Teamitem/TeamItem'
import useFilterTeamBySide from '../../hooks/useFilterTeamBySide'
import useFilterPlayersBySide from '../../hooks/useFilterPlayersBySide'
import Footer from './Footer/Footer'

interface Props {
  players: IPlayers[];
  teams: ITeams[];
  currentPlayerId: ICurrentPlayer;
}

const findCurrentPlayer = (playerId: number, players: IPlayers[]) => {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === playerId) {
      return players[i];
    }
  }
}

const Scoreboard: FC<Props> = ({ currentPlayerId, players, teams }) => {          

  const [[sortScoreboard, desSortScorboard], setSortScoreboard] = useState<[string, boolean]>(['kills', true])

  const currentPlayer = findCurrentPlayer(currentPlayerId.id, players)

  const sortedPlayers = useMemo(() => {
    const sortedPlayers = sortScoreboard === 'kills' ?
      players.slice().sort((a, b) => desSortScorboard ? b.kills - a.kills : a.kills - b.kills) :
      sortScoreboard === 'assists' ?
        players.slice().sort((a, b) => desSortScorboard ? b.assists - a.assists : a.assists - b.assists) :
        players.slice().sort((a, b) => desSortScorboard ? b.death - a.death : a.death - b.death)

    return sortedPlayers;
  }, [players, sortScoreboard, desSortScorboard])

  const attackPlayers = useFilterPlayersBySide(sortedPlayers, 'attack')
  const defensePlayers = useFilterPlayersBySide(sortedPlayers, 'defense')
  const spectatorPlayers = useFilterPlayersBySide(sortedPlayers, 'spectator')
  const attackTeam = useFilterTeamBySide(teams, 'attack')
  const defenseTeam = useFilterTeamBySide(teams, 'defense')

  const changeSort = (type: string) => {
    type === sortScoreboard ?
      setSortScoreboard([sortScoreboard, !desSortScorboard]) :
      setSortScoreboard([type, true])
  }

  return (
    <div className={cl(s.scoreboard, s.active)}>
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
      <Footer spectators={spectatorPlayers}/>
    </div>
  )
}

export default Scoreboard;