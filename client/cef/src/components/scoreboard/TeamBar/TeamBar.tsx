import React, { FC } from 'react'
import * as s from './TeamBar.module.sass'

interface Props {
  color: string | undefined;
  changeSort:(type: string) => void;
}

const TeamBar: FC<Props> = ({ color, changeSort }) => {

  // add svg for ping
  return (
    <div className={s.teamBar}>
      <div className={s.position}>
        №
      </div>
      <div onClick={() => changeSort('name')} className={s.name}>
        Player name
      </div>
      <div onClick={() => changeSort('kills')} className={s.statistics}>
        K
      </div>
      <div onClick={() => changeSort('death')} className={s.statistics}>
        D
      </div>
      <div onClick={() => changeSort('assists')} className={s.statistics}>
        A
      </div>
      <div className={s.statistics}>
        LVL
      </div>
      <div className={s.statistics}>
        ---
      </div>
    </div>
  )
}

export default TeamBar