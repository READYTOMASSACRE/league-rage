import React, { CSSProperties, FC } from 'react'
import { IWeapon } from '../../../types';
import * as s from './WeaponSelectorItem.module.sass'

interface Props {
  weapon?: IWeapon;
  position?: number;
  category?: string
  setCattegory?: (value: string) => void;
  setGun?: (value: Object) => void;
}

const WeaponSelectorItem: FC<Props> = ({ weapon, position, setCattegory, setGun, category }) => {

  const style: CSSProperties = {
    marginTop: category === ' ' ? 'auto' : undefined
  }

  return (
    <div
      className={s.container}
      style={style}
      onMouseOver={() => setGun && weapon && setGun(weapon)}
      onMouseOut={() => setGun && setGun({})}
      onClick={() => setCattegory && category && setCattegory(category)}
    >
      {position} {category ? category : weapon?.name}
    </div>
  )
}

export default WeaponSelectorItem
