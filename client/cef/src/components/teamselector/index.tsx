import React, { FC, useEffect, useState } from 'react'
import { Events } from '../../../../league-core/src/types'
import * as styles from './selector.module.sass'
import cls from 'classnames'
import RageAPI from '../../helpers/RageAPI'

const TeamSelector: FC = () => {
  const [active, setActive] = useState(false)
  const [{team, color}, setData] = useState({team: '', color: ''})

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.team.select_toggle'], 'teamselector', (team = '', color = '', toggle = false) => {
      setActive(toggle)
      setData({team, color})
    })

    return () => {
      RageAPI.unsubscribe(Events['tdm.team.select_toggle'], 'teamselector')
    }
  }, [])

  if (!active) return <></>

  return (
    <div className={cls(styles.item, styles.active)} style={color?.length ? { color } : {}}>{team}</div>
  )
}

export default TeamSelector
