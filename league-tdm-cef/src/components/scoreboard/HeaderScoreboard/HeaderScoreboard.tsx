import React, { FC } from 'react'
import { ITeams } from '../../../types'
import cl from 'classnames'
import s from './HeaderScoreboard.module.sass'

interface Props {
  attackTeam: ITeams | undefined;
  defenseTeam: ITeams | undefined;
}

const HeaderScoreboard: FC<Props> = ({ attackTeam, defenseTeam }) => {

  // clown? potribno zrobiti oirmal'no
  return (
    <div style={{ background: `linear-gradient(90deg, rgba(0,5,255,0.6) 0%, rgba(52,52,52,1) 50%, rgba(52,52,52,1) 50%, rgba(255,0,0,0.6) 100%)` }} className={cl(s.top)}>
      <>
        <div className={s.left_team_name}>{attackTeam?.name === '' ? attackTeam.role : attackTeam?.name}</div>
        <div className={s.left_team_score}>{attackTeam?.score}</div>
      </>
      <div className={s.round_time}>
        1:47
      </div>
      <div className={s.arena_name}>
        Arena name
      </div>
      <>
        <div className={s.right_team_name}>{defenseTeam?.name === '' ? defenseTeam.role : defenseTeam?.name}</div>
        <div className={s.right_team_score}>{defenseTeam?.score}</div>
      </>
    </div>
  )
}

export default HeaderScoreboard
