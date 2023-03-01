import React, { FC, useMemo, useState } from 'react'
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

  const attackPlayers = useFilterPlayersBySide(players, 'attack')
  const defensePlayers = useFilterPlayersBySide(players, 'defense')
  const attackTeam = useFilterTeamBySide(teams, 'attack')
  const defenseTeam = useFilterTeamBySide(teams, 'defense')

  const currentPlayer = findCurrentPlayer(currentPlayerId.id, players)

  return (
    <div className={cl(s.scoreboard, s.active)}>
      <HeaderScoreboard teams={teams} />
      <TeamItem side={'left'}>
        <TeamBar team={attackTeam} />
        <ListOfPlayers>
          {players && attackPlayers.map((player, index) =>
            <PlayerItem
              key={player.id}
              player={player}
              currentPlayer={currentPlayer?.id === player.id ? true : false} position={index + 1}
            />
          )}
        </ListOfPlayers>
      </TeamItem>
      <TeamItem side={'right'}>
        <TeamBar team={defenseTeam} />
        <ListOfPlayers>
          {players && defensePlayers.map((player, index) =>
            <PlayerItem
              key={player.id}
              player={player}
              currentPlayer={currentPlayer?.id === player.id ? true : false} position={index + 1}
            />
          )}
        </ListOfPlayers>
      </TeamItem>
      {/* make boat component */}
      <div className={cl(s.bottom)}>
        bottom
      </div>
    </div>
  )
}

export default Scoreboard;