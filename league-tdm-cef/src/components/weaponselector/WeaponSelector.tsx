import { nanoid } from 'nanoid'
import React, { useEffect, useState } from 'react'
import WeaponSection from './WeaponInfoSection.tsx/WeaponSection'
import * as s from './WeaponSelector.module.sass'
import WeaponSelectorItem from './WeaponSelectorItem/WeaponSelectorItem'
import { cef, Events } from '../../../../league-core/src/types'
import cefLog from '../../helpers/cefLog'
import RageAPI from '../../helpers/RageAPI'

const WeaponSelector = () => {

  const [active, setActive] = useState<boolean>(false)
  const [data, setData] = useState<Record<string, cef.Weapon[]>>({})
  const [category, setCategory] = useState<string>('')
  const [currentWeapon, setWeapon] = useState<cef.Weapon | undefined>()

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.weapon.request'], 'weaponselector', (jsonData: string, toggle: boolean) => {
      try {
        const data = JSON.parse(jsonData)
        setActive(toggle)
        if (!toggle) {
          setCategory('')
          setWeapon(undefined)
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
      <div className={s.listside}>
        <div className={s.buttonback} onClick={() => setCategory(' ')}>
          {'<-'}
        </div>
        <div className={s.list}>
          {category === '' ? Object.keys(data).map((categoryName, index) =>
            <WeaponSelectorItem key={nanoid(5)} setCategory={setCategory} position={index + 1} category={categoryName} />
          ) :
            data[category].map((weapon, index) =>
              <WeaponSelectorItem key={nanoid(5)} setWeapon={setWeapon} position={index + 1} weapon={weapon} />
            )
          }
        </div>
      </div>
      <WeaponSection weapon={currentWeapon} />
    </div>
  )
}

export default WeaponSelector
