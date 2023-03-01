import React, { FC, useMemo, useState } from 'react'
import s from './Scoreboard.module.sass'
import cl from 'classnames'
import ListOfPlayers from './ListOfPlayer/ListOfPlayers'
import PlayerItem from './PlayerItem/PlayerItem'
import TeamBar from './TeamBar/TeamBar'
import { ICurrentPlayer, IPlayers, ITeams } from '../../types'
import HeaderScoreboard from './HeaderScoreboard/HeaderScoreboard'

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

  const [attackSideName, setAttackSideName] = useState<string>('Attackers')
  const [defenseSideName, setDefenseSideName] = useState<string>('Defenders')
  const [sortScoreboard, setSortScoreboard] = useState<string>('kills')

  const sortedPlayers = useMemo(() => {
    // more sort (assist/death/score)
    const sortedPlayers = sortScoreboard === 'kills' ? 
    players.sort((a, b) => a.kills > b.kills ? -1 : 1) : 
    players.sort((a, b) => a.death > b.death ? -1 : 1)

    return sortedPlayers;
  }, [players, sortScoreboard])

  // add hoock for filter

  const attackers = useMemo(() => {
    const role = 'attack'
    const attackers = sortedPlayers.filter(player =>
      player.role === role && player
    )

    return attackers;
  }, [sortedPlayers])

  const defenders = useMemo(() => {
    const role = 'defense'
    const defenders = sortedPlayers.filter(player =>
      player.role === role && player
    )

    return defenders;
  }, [sortedPlayers])

  const currentPlayer = findCurrentPlayer(currentPlayerId.id, players)

// add team commponent

  return (
    <div className={cl(s.scoreboard, s.active)}>
      <HeaderScoreboard teams={teams} />
      <div className={cl(s.left_team)}>
        {teams && teams.map(team =>
          team.role === 'attack' && (
            <TeamBar team={team} />
          )
        )}
        <ListOfPlayers>
          {players && attackers.map((player, index) =>
            <PlayerItem key={player.id} player={player} currentPlayer={currentPlayer?.id === player.id ? true : false} position={index + 1} />
          )}
        </ListOfPlayers>
      </div>
      <div className={cl(s.right_team)}>
        {teams && teams.map(team =>
          team.role === 'defense' && (
            <TeamBar team={team} />
          )
        )}
        <ListOfPlayers>
          {players && defenders.map((player, index) =>
            <PlayerItem key={player.id} player={player} currentPlayer={currentPlayer?.id === player.id ? true : false} position={index + 1} />
          )}
        </ListOfPlayers>
      </div>
      {/* make boat component */}
      <div className={cl(s.bottom)}>
        bottom
      </div>
    </div>
  )
}

export default Scoreboard;