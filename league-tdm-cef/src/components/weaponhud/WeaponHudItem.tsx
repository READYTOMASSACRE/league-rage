import React, { FC } from 'react'
import * as s from './styles/WeaponHudItem.module.sass'
import cl from 'classnames'
import { weaponSlot } from '../../weaponNameForUI'

interface Weapon {
  name: string
  slot: string
}

interface Props {
  weapon: Weapon
  current?: boolean
}

const WeaponHudItem: FC<Props> = ({ weapon, current }) => {

  return (
    <div className={cl(s.item, current && s.current)}>
      <img className={s.image} src={`/assets/weapons/${weapon.name}.webp/`} alt='' />
      <div className={s.slot}>{weaponSlot[weapon.slot]}</div>
      <div className={s.name}>{weapon.name}</div>
    </div>
  )
}

export default WeaponHudItem