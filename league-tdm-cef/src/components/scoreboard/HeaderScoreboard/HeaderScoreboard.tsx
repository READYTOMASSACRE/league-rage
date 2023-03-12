import React, { FC, useEffect, useMemo, useState } from 'react'
import cl from 'classnames'
import * as s from './HeaderScoreboard.module.sass'
import { Events, scoreboard } from '../../../../../league-core/src/types';
import { helpers } from '../../../../../league-core/client';

interface Props {
  attackTeam?: scoreboard.Team
  defenseTeam?: scoreboard.Team
  arena?: string
}

const HeaderScoreboard: FC<Props> = ({ attackTeam, defenseTeam, arena = 'Not_found' }) => {
  const [time, setTime] = useState('00:00')

  useEffect(() => {
    mp.events.add(Events['tdm.scoreboard.data'], (time: string) => {
      setTime(time)
    })
  }, [])

  const defaultColor = 'white'

  let { color: attackColor = '' } = attackTeam || {}
  let { color: defenseColor = '' } = defenseTeam || {}

  attackColor = (
    attackColor.match(helpers.hexregex) ||
    attackColor.match(helpers.rgabregex)
  ) ? attackColor : defaultColor
  defenseColor = (
    defenseColor.match(helpers.hexregex) ||
    defenseColor.match(helpers.rgabregex)
  ) ? defenseColor : defaultColor

  // rgba(0,5,255,0.6) attack
  // rgba(255,0,0,0.6) defense
  const timebar = useMemo(() => {
    return <div className={s.round_time}>{time}</div>
  }, [time])

  // clown? potribno zrobiti oirmal'no
  return (
    <div
      style={{ background: `linear-gradient(90deg, ${attackColor} 0%, rgba(52,52,52,1) 50%, rgba(52,52,52,1) 50%, ${defenseColor} 100%)` }}
      className={cl(s.top)}
    >
      <div className={s.left_team_name}>{attackTeam?.name === '' ? attackTeam.role : attackTeam?.name}</div>
      <div className={s.left_team_score}>{attackTeam?.score}</div>
      {timebar}
      <div className={s.arena_name}>{arena}</div>
      <div className={s.right_team_name}>{defenseTeam?.name === '' ? defenseTeam.role : defenseTeam?.name}</div>
      <div className={s.right_team_score}>{defenseTeam?.score}</div>
    </div>
  )
}

export default HeaderScoreboard
