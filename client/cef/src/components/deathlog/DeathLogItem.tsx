import React, { FC, useEffect, useState } from 'react'
import * as s from './DeathLogItem.module.sass'
import { deathlog } from '../../../../league-core/src/types'

interface Props {
  data: deathlog.DeathLog
}

const DeathLogItem: FC<Props> = ({ data }) => {

  return (
    <div className={s.item}>
      <div className={s.name} style={{ color: data.killer.color }}>
        {data.killer.name}
      </div>
      <img src={`/assets/weapons/${data.weapon}.webp`} alt='' />
      <div className={s.name} style={{ color: data.victim.color }}>
        {data.victim.name}
      </div>
    </div>
  )
}

export default DeathLogItem