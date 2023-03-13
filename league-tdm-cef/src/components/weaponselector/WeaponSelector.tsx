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
  handguns: 'Buy Pistol (Secondary Weapond)',
  submachine: 'Buy SMG (Primary Weapond)',
  shotguns: 'Buy Shotgun (Primary Weapond)',
  rifles: 'Buy Rifle (Primary Weapond)',
  light_rifles: 'Buy Light Rifle (Primary Weapond)',
  sniper_rifles: 'Buy Sniper Rifle (Primary Weapond)',
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
        {category ? typeCategory[category] : 'Buy Weapon'}
      </div>
      <div className={s.list}>
        {!category ? Object.keys(data).map((categoryName) =>
          <WeaponSelectorItem key={nanoid(5)} setCategory={setCategory} category={categoryName} />
        ) :
          data[category].map((weapon) =>
            <WeaponSelectorItem key={nanoid(5)} setCurrentWeapon={setCurrentWeapon} weapon={weapon} />
          )
        }
        <WeaponSelectorItem setCategory={setCategory} text={category ? 'Cancel' : 'Close'} />
      </div>
      <WeaponSection weapon={currentWeapon} />
    </div>
  )
}

export default WeaponSelector
