import { nanoid } from 'nanoid'
import React, { useEffect, useState } from 'react'
import WeaponSection from './WeaponInfoSection.tsx/WeaponSection'
import * as s from './WeaponSelector.module.sass'
import WeaponSelectorItem from './WeaponSelectorItem/WeaponSelectorItem'
import { cef, Events } from '../../../../league-core/src/types'
import cefLog from '../../helpers/cefLog'
import RageAPI from '../../helpers/RageAPI'

const typeCategory = {
  melee: 'Buy Melle (Melle Weapon)',
  handguns: 'Buy Pistol (Second Weapond)',
  submachine: 'Buy SMG (Primary Weapond)',
  shotguns: 'But Shotgun (Primary Weapond)',
  rifles: 'But Rifle (Primary Weapond)',
  light_rifles: 'But Light Rifle (Primary Weapond)',
  sniper_rifles: 'But Sniper Rofle (Primary Weapond)',
}

const WeaponSelector = () => {

  const [active, setActive] = useState<boolean>(false)
  const [data, setData] = useState<Record<string, cef.Weapon[]>>({})
  const [category, setCategory] = useState<string | undefined>(undefined)
  const [currentWeapon, setCurrentWeapon] = useState<cef.Weapon | undefined>()

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.weapon.request'], 'weaponselector', (jsonData: string, toggle: boolean) => {
      try {
        const data = JSON.parse(jsonData)
        setActive(toggle)
        if (!toggle) {
          setCategory('')
          setCurrentWeapon(undefined)
        }
        if (typeof data === 'object') setData(data)
      } catch (err) {
        cefLog(err)
      }
    })

    return () => {
      RageAPI.unsubscribe(Events['tdm.weapon.request'], 'weaponselector')
    }
  }, [])

  if (!active) return <></>

  return (
    <div className={s.container}>
      <div className={s.header}>
        {category ? category && typeCategory[category] : 'Buy Weapon'}
      </div>
      <div className={s.list}>
        {!category ? Object.keys(data).map((categoryName, index) =>
          <WeaponSelectorItem key={nanoid(5)} setCategory={setCategory} position={index + 1} category={categoryName} />
        ) :
          
          data[category].map((weapon, index) =>
            <WeaponSelectorItem key={nanoid(5)} setCurrentWeapon={setCurrentWeapon} position={index + 1} weapon={weapon} />
          )
        }
        <WeaponSelectorItem setCurrentWeapon={setCurrentWeapon} setActive={setActive} position={0} text={category ? 'Cancel' : 'Close'}/>
      </div>
      <WeaponSection weapon={currentWeapon} />
    </div>
  )
}

export default WeaponSelector
