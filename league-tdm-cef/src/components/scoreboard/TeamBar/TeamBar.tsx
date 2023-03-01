import React, { FC } from 'react'
import cl from 'classnames'
import s from './TeamBar.module.sass'
import { ITeams } from '../../../types'

interface Props {
  team: ITeams;
}

const backStyle = (role: string) => {
  const style = role === 'attack' ? 
  {backgroundColor: 'rgba(0, 0, 255, 0.3)'} : 
  {backgroundColor: 'rgba(255, 0, 0, 0.3)'}
  return style;
}

const spaces = '\xa0\xa0\xa0-\xa0\xa0\xa0'

const TeamBar: FC<Props> = ({ team }) => {
// change name_role to № and Nickname, add svg for ping
  return (
    <div className={s.teamBar} style={backStyle(team.role)}>
      <div className={s.name_role}>
        {team.name + spaces + team.role.toUpperCase()}
      </div>
      <div className={s.kills}>
        K
      </div>
      <div className={s.assists}>
        A
      </div>
      <div className={s.death}>
        D
      </div>
      <div className={s.ping}>
        ---
      </div>
    </div>
  )
}

export default TeamBar