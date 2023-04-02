import React, { FC, useEffect, useMemo, useState } from 'react'
import * as s from './styles/WeaponHud.module.sass'
import WeaponHudItem from './WeaponHudItem'
import { weaponSlot } from '../../weaponNameForUI'
import RageAPI from '../../helpers/RageAPI'
import { Events } from '../../../../league-core/src/types'
import cefLog from '../../helpers/cefLog'

// const data = [
//   { name: 'assaultrifle-mk2', slot: 'primary' },
//   { name: 'bat', slot: 'melee' },
// ]

interface WeaponData {
  primary?: string
  secondary?: string
  melee?: string
}

const WeaponHud: FC = ({ }) => {

  const [playerWeapons, setPlayerWeapons] = useState<WeaponData>()
  const [currentWeapon, setCurrentWeapon] = useState<string>('')

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.cef.weapon_hud'], 'weapon_hud', (playerWeapons: string, currentWeapon?: string) => {
      try {
        setPlayerWeapons(JSON.parse(playerWeapons))
        if (currentWeapon) setCurrentWeapon(currentWeapon)
      } catch(err) {
        cefLog(err)
      }
    })

    // setPlayerWeapons(data)
    // setCurrentWeapon('assaultrifle-mk2')

    return () => {
      RageAPI.unsubscribe(Events['tdm.cef.weapon_hud'], 'weapon_hud')
    }
  }, [])

  const items = useMemo(() => {
    if (!playerWeapons) return []

    return Object.entries(playerWeapons).map(([slot, weapon], index) => (
      <WeaponHudItem key={index} current={currentWeapon === weapon} slot={slot} weapon={weapon} />
    ))
  }, [playerWeapons, currentWeapon])

  if (!playerWeapons) return <></>

  return (
    <div className={s.container}>
      {items}
    </div>
  )
}

export default WeaponHud