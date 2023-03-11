import { nanoid } from 'nanoid'
import React, { useState } from 'react'
import { Categories, IWeapon } from '../../types'
import WeaponSection from './GunInfoSection.tsx/WeaponSection'
import * as s from './WeaponSelector.module.sass'
import WeaponSelectorItem from './GunSelectorItem/WeaponSelectorItem'

const data: Categories = {
  melle: [{ name: 'k1', damage: 35, firerate: 20 }, { name: 'k2', damage: 45 },],
  pistol: [{ name: 'p1', damage: 20 }, { name: 'pistol2', damage: 30 },],
  shotgun: [{ name: 'sg1', damage: 80 }, { name: 'sg2', damage: 75 },],
  smg: [{ name: 'smg1', damage: 20, firerate: 500 }, { name: 'smg2', damage: 18 },],
  assault_rifel: [{ name: 'ar1', damage: 40 }, { name: 'ar2', damage: 45 },],
  sniper_rifle: [{ name: 'sr1', damage: 60 }, { name: 'sr2', damage: 100 },],
  machinegun: [{ name: 'mg1', damage: 50 }, { name: 'mg2', damage: 55 },],
}

const color = {
  info: '#1b57b194',
  success: '#0aa15b94',
  error: '#d3323294',
  warning: '#cfc52f94',
  common: '#5c5c5c94'
}

const WeaponSelector = () => {

  const [category, setCattegory] = useState<string>(' ')
  const [currentWeapon, setGun] = useState<Partial<IWeapon>>({})

  return (
    <div className={s.container}>
      <div className={s.listside}>
        <div className={s.buttonback} onClick={() => setCattegory(' ')}>
          {'<-'}
        </div>
        <div className={s.list}>
          {category === ' ' ? Object.keys(data).map((categoryName, index) =>
            <WeaponSelectorItem key={nanoid(5)} setCattegory={setCattegory} position={index + 1} category={categoryName} />
          ) :
            data[category].map((weapon, index) =>
              <WeaponSelectorItem key={nanoid(5)} setGun={setGun} position={index + 1} weapon={weapon} />
            )
          }
        </div>
      </div>
      <WeaponSection weapon={currentWeapon} />
    </div>
  )
}

export default WeaponSelector
