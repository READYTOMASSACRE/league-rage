import React, { FC, useEffect, useState } from 'react'
import { Events } from '../../../../league-core/src/types'
import * as styles from './selector.module.sass'
import cls from 'classnames'

const Selector: FC = () => {
  const [classname, setClassname] = useState(styles.item)
  const [team, setTeam] = useState('')

  useEffect(() => {
    mp.events.add(Events['tdm.team.select_toggle'], (team: string = '', toggle: boolean = false) => {
      setClassname(toggle ? cls(styles.item, styles.active): styles.item)
      setTeam(team)
    })

  }, [])

  return (
    <div className={classname}>{team}</div>
  )
}

export default Selector
