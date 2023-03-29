import React, { FC, useEffect, useMemo, useState } from 'react'
import * as s from './styles/WeaponHud.module.sass'
import WeaponHudItem from './WeaponHudItem'
import { weaponSlot } from '../../weaponNameForUI'

const data = [
  // { name: 'assaultrifle-mk2', slot: 'primary' },
  // { name: 'bat', slot: 'melee' },
]

const WeaponHud: FC = ({ }) => {

  const [playerWeapons, setPlayerWeapons] = useState<any[]>([])
  const [curretnWeapon, setCurrentWeapon] = useState<string>('')

  useEffect(() => {
    setPlayerWeapons(data)
    setCurrentWeapon('assaultrifle-mk2')
  }, [])

  const items = useMemo(() => {
    const arr = playerWeapons.slice().sort((a, b) => weaponSlot[a.slot] - weaponSlot[b.slot])

    return arr.map((weapon) => <WeaponHudItem current={curretnWeapon === weapon.name && true} key={weapon.name} weapon={weapon} />)
  }, [playerWeapons, curretnWeapon])

  if (!playerWeapons.length) return <></>

  return (
    <div className={s.container}>
      {items}
    </div>
  )
}

export default WeaponHud