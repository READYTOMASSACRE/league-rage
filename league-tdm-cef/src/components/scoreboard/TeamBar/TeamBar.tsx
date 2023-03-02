import React, { FC } from 'react'
import cl from 'classnames'
import s from './TeamBar.module.sass'
import { ITeams } from '../../../types'

interface Props {
  color: string | undefined;
  changeSort:(type: string) => void;
}

// const backStyle = (color: string | undefined) => {
//   const style = { backgroundColor: `${color}` }
//   return style;
// }

const TeamBar: FC<Props> = ({ color, changeSort }) => {

  // add svg for ping
  return (
    <div className={s.teamBar}>
      <div className={s.position}>
        №
      </div>
      <div className={s.name}>
        Player name
      </div>
      <div onClick={() => changeSort('kills')} className={s.kills}>
        K
      </div>
      <div onClick={() => changeSort('assists')} className={s.assists}>
        A
      </div>
      <div onClick={() => changeSort('death')} className={s.death}>
        D
      </div>
      <div className={s.ping}>
        ---
      </div>
    </div>
  )
}

export default TeamBar