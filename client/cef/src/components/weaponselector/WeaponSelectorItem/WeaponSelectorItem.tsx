import React, { CSSProperties, FC } from 'react'
import { cef } from '../../../../../../core/src/types';
import RageAPI from '../../../helpers/RageAPI';
import { weaponNames } from '../../../weaponNameForUI';
import * as s from './WeaponSelectorItem.module.sass'

interface Props {
  weapon?: cef.Weapon
  position?: number
  category?: string
  text?: string
  setCategory?: (value: string | undefined) => void
  setCurrentWeapon?: (value?: cef.Weapon) => void
  setActive?: (value: boolean) => void
}

const WeaponSelectorItem: FC<Props> = ({ weapon, position, setCategory, setCurrentWeapon, category, text }) => {

  const style: CSSProperties = {
    marginTop: text ? 'auto' : undefined
  }

  const name = () => {
    if (category) return category[0].toUpperCase() + category.slice(1).replace('_', ' ')
    if (weapon) return weapon.name ? weaponNames[weapon.name] : 'none'
    if (!weapon && !category) return text
  }

  const toggle = () => {
    if (text === 'Cancel') setCategory && setCategory(undefined)
    if (text === 'Close') RageAPI.weaponToggle()
  }

  return (
    <div
      className={s.container}
      style={style}
      onMouseOver={() => setCurrentWeapon && weapon && setCurrentWeapon(weapon)}
      onMouseOut={() => setCurrentWeapon && setCurrentWeapon(undefined)}
      onClick={() => {
        category && setCategory && setCategory(category);
        weapon && RageAPI.weaponSubmit(weapon?.name);
        toggle()
      }}
    >
      {position} {name()}
    </div>
  )
}

export default WeaponSelectorItem
