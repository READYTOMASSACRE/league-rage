import React, { CSSProperties, FC } from 'react'
import { cef, Events } from '../../../../../league-core/src/types';
import RageAPI from '../../../helpers/RageAPI';
import weaponNameForUI from '../../../weaponNameForUI';
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

const WeaponSelectorItem: FC<Props> = ({ weapon, position, setCategory, setCurrentWeapon, category, text, setActive }) => {

  const style: CSSProperties = {
    marginTop: text ? 'auto' : undefined
  }

  const name = () => {
    if(category) return category[0].toUpperCase() + category.slice(1).replace('_', ' ')
    if(weapon)  return weapon.name ? weaponNameForUI[weapon.name] : 'none'
    if(!weapon && !category) return text
  }

  return (
    <div
      className={s.container}
      style={style}
      onMouseOver={() => setCurrentWeapon && weapon && setCurrentWeapon(weapon)}
      onMouseOut={() => setCurrentWeapon && setCurrentWeapon(undefined)}
      onClick={() => {
        setCategory && category && setCategory(category);
        weapon && RageAPI.weaponSubmit(weapon?.name);
        text && text === 'Cancel' ? setCategory && setCategory(undefined) : setActive && setActive(false)
      }}
    >
      {position} {name()}
    </div>
  )
}

export default WeaponSelectorItem
