import React, { FC } from 'react'
import * as s from './WeaponSection.module.sass'
import WeaponSectionItem from '../WeaponSectionItem/WeaponSectionItem';
import { cef } from '../../../../../league-core/src/types';


interface Props {
  weapon?: cef.Weapon;
}

const MAX_DAMAGE = 100
const MAX_FIRERATE = 1000

const WeaponSection: FC<Props> = ({ weapon }) => {


  console.log(weapon)

  return (
    <div className={s.container}>
      {weapon ? (
        <>
          <div className={s.container_img}>
            <img src={`/assets/weapons/${weapon.name}.webp`} alt={`${weapon.name}`}/>
          </div>
          <div className={s.weapon_info}>
            <WeaponSectionItem title={'Damage'} value={weapon.damage} barmaxvalue={MAX_DAMAGE}/>
            <WeaponSectionItem title={'Firerate'} value={weapon.firerate} barmaxvalue={MAX_FIRERATE}/>
          </div>
        </>
      ) :
        <div>Choose category</div>
      }
    </div>
  )
}

export default WeaponSection
