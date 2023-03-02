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
          <React.Fragment key={team.id}>
            <div className={s.left_team_name}>{team.name === '' ? team.role : team.name}</div>
            <div className={s.left_team_score}>{team.score}</div>
          </React.Fragment>
        )
      )}
      <div className={s.round_time}>
        1:47
      </div>
      <div className={s.arena_name}>
        Arena name
      </div>
      {teams.map(team =>
        team.role === 'defense' && (
          <React.Fragment key={team.id}>
            <div className={s.right_team_name}>{team.name === '' ? team.role : team.name}</div>
            <div className={s.right_team_score}>{team.score}</div>
          </React.Fragment>
        )
      )}
    </div>
  )
}

export default HeaderScoreboard
