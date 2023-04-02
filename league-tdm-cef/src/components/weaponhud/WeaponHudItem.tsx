import React, { FC } from 'react'
import * as s from './styles/WeaponHudItem.module.sass'
import cl from 'classnames'
import { weaponSlot } from '../../weaponNameForUI'

interface Props {
  weapon: string
  slot: string
  current?: boolean
}

const WeaponHudItem: FC<Props> = ({ weapon, slot, current }) => {
  return (
    <div className={cl(s.item, current && s.current)}>
      <img className={s.image} src={`/assets/weapons/${weapon}.webp/`} alt='' />
      <div className={s.slot}>{weaponSlot[slot]}</div>
      <div className={s.name}>{weapon}</div>
    </div>
  )
}

export default WeaponHudItem