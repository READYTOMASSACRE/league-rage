import React, { FC, useEffect, useMemo, useState } from 'react'
import cl from 'classnames'
import * as s from './HeaderScoreboard.module.sass'
import { scoreboard } from '../../../../../league-core/src/types';
import { toColor } from '../../../../../league-core/src/helpers';

interface Props {
  attackTeam?: scoreboard.Team
  defenseTeam?: scoreboard.Team
  arena?: string
}

const HeaderScoreboard: FC<Props> = ({ attackTeam, defenseTeam, arena = '' }) => {
  const defaultColor = 'white'

  let { color: attackColor = '' } = attackTeam || {}
  let { color: defenseColor = '' } = defenseTeam || {}

  attackColor = toColor(attackColor, defaultColor)
  defenseColor = toColor(defenseColor, defaultColor)

  // clown? potribno zrobiti oirmal'no
  return (
    <div
      style={{ background: `linear-gradient(90deg, ${attackColor} 0%, rgba(52,52,52,1) 50%, rgba(52,52,52,1) 50%, ${defenseColor} 100%)` }}
      className={cl(s.top)}
    >
      <div className={s.left_team_name}>{attackTeam?.name === '' ? attackTeam.role : attackTeam?.name}</div>
      <div className={s.left_team_score}>{attackTeam?.score}</div>
      <div className={s.arena_name}>{arena}</div>
      <div className={s.right_team_name}>{defenseTeam?.name === '' ? defenseTeam.role : defenseTeam?.name}</div>
      <div className={s.right_team_score}>{defenseTeam?.score}</div>
    </div>
  )
}

export default HeaderScoreboard