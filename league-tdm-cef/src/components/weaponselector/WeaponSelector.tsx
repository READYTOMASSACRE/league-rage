import { nanoid } from 'nanoid'
import React, { useEffect, useRef, useState } from 'react'
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

  const listRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (listRef.current) {
      listRef.current.focus()
    }
  }, [category, active, currentWeapon])

  if (!active) return <></>

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const categoryIndex = +e.key

    if (Number.isNaN(categoryIndex)) {
      return
    }

    if (categoryIndex >= 1 && categoryIndex <= 9) {
      if (category && data[category][categoryIndex - 1]) {
        RageAPI.weaponSubmit(data[category][categoryIndex - 1].name)
        return setCategory(undefined)
      }

      return setCategory(Object.keys(data)[categoryIndex - 1])
    }

    if (categoryIndex === 0) {
      return category ? setCategory(undefined) : RageAPI.weaponToggle()
    }
  }

  return (
    <div tabIndex={0} className={s.container} ref={listRef} onKeyDown={(e) => onKeyDown(e)}>
      <div className={s.header}>
        {category ? typeCategory[category] : 'Buy Weapon'}
      </div>
      <div className={s.list}>
        {!category ? Object.keys(data).map((categoryName, index) =>
          <WeaponSelectorItem key={nanoid(5)} position={index + 1} setCategory={setCategory} category={categoryName} />
        ) :
          data[category].map((weapon, index) =>
            <WeaponSelectorItem key={nanoid(5)} position={index + 1} setCurrentWeapon={setCurrentWeapon} weapon={weapon} />
          )
        }
        <WeaponSelectorItem setCategory={setCategory} position={0} text={category ? 'Cancel' : 'Close'} />
      </div>
      <WeaponSection weapon={currentWeapon} />
    </div>
  )
}

export default WeaponSelector
