import React, { FC, useEffect, useState } from 'react'
import { Events } from '../../../../league-core/src/types'
import * as styles from './selector.module.sass'
import cls from 'classnames'

const TeamSelector: FC = () => {
  const [classname, setClassname] = useState(styles.item)
  const [{team, color}, setData] = useState({team: '', color: ''})

  useEffect(() => {
    mp.events.add(Events['tdm.team.select_toggle'], (team = '', color = '', toggle = false) => {
      setClassname(toggle ? cls(styles.item, styles.active): styles.item)
      setData({team, color})
    })

  }, [])

  return (
    <div className={classname} style={color?.length ? { color } : {}}>{team}</div>
  )
}

export default TeamSelector
