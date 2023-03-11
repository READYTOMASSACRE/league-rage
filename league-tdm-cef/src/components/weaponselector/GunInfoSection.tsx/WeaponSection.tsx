import React, { FC, useEffect, useState } from 'react'
import { IWeapon } from '../../../types'
import * as s from './WeaponSection.module.sass'
import WeaponSectionItem from '../WeaponSectionItem/WeaponSectionItem';


interface Props {
  weapon?: IWeapon;
}

const MAX_DAMAGE = 100
const MAX_FIRERATE = 1000

const WeaponSection: FC<Props> = ({ weapon }) => {

  return (
    <div className={s.container}>
      {weapon && Object.keys(weapon).length > 0 ? (
        <>
          <div className={s.container_img}>
            <img className={s.img} alt='' src="/assets/weapons/advancedrifle.webp" />
          </div>
          <div>
            <WeaponSectionItem title={'Damage'} value={weapon.damage} barmaxvalue={MAX_DAMAGE}/>
            <WeaponSectionItem title={'Firerate'} value={weapon.firerate} barmaxvalue={MAX_FIRERATE}/>
          </div>
        </>
      ) :
        <div>Choose categoty</div>
      }
    </div>
  )
}

export default WeaponSection
