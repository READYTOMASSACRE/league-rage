import React, { CSSProperties, FC } from 'react'
import { cef } from '../../../../../league-core/src/types';
import RageAPI from '../../../helpers/RageAPI';
import weaponNameForUI from '../../../weaponNameForUI';
import * as s from './WeaponSelectorItem.module.sass'

interface Props {
  weapon?: cef.Weapon;
  position?: number;
  category?: string
  setCategory?: (value: string) => void;
  setWeapon?: (value?: cef.Weapon) => void;
}

const WeaponSelectorItem: FC<Props> = ({ weapon, position, setCategory, setWeapon, category }) => {

  const style: CSSProperties = {
    marginTop: category === ' ' ? 'auto' : undefined
  }

  const name = () => {
    if(category) return category[0].toUpperCase() + category.slice(1).replace('_', ' ')
    if(weapon)  return weapon.name ? weaponNameForUI[weapon.name] : 'none'
  }

  return (
    <div
      className={s.container}
      style={style}
      onMouseOver={() => setWeapon && weapon && setWeapon(weapon)}
      onMouseOut={() => setWeapon && setWeapon()}
      onClick={() => {
        setCategory && category && setCategory(category);
        weapon && RageAPI.weaponSubmit(weapon?.name)
      }}
    >
      {position} {name()}
    </div>
  )
}

export default WeaponSelectorItem
