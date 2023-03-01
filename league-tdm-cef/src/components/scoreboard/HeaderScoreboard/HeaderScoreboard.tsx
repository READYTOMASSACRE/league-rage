import React, { FC } from 'react'
import { ITeams } from '../../../types'
import cl from 'classnames'
import s from './HeaderScoreboard.module.sass'

interface Props {
  teams: ITeams[];
}

const HeaderScoreboard: FC<Props> = ({ teams }) => {
  // clown? potribno zrobiti oirmal'no
  return (
    <div className={cl(s.top)}>
        {teams.map(team =>
          team.role === 'attack' && (
            <div key={team.role} className={s.left_team_score}>{team.name} {team.score}</div>
          )
        )}
        <div className={s.chertochkaXD}>
          -
        </div>
        {teams.map(team =>
          team.role === 'defense' && (
            <div key={team.role} className={s.right_team_score}>{team.score} {team.name}</div>
          )
        )}
      </div>
  )
}

export default HeaderScoreboard
