import React, { FC, useEffect, useState } from 'react'
import { Events } from '../../../../../core/src/types'
import * as styles from './selector.module.sass'
import * as controlStyles from '../controls/controls.module.sass'

import cls from 'classnames'
import RageAPI from '../../helpers/RageAPI'
import { Lang } from '../../../../../lang/language'

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

  const controls = cls(controlStyles.key, controlStyles.medium)
  return (
    <>
      <div className={cls(styles.item, styles.active)} style={color?.length ? { color } : {}}>{team}</div>
      <div className={styles.guide}>
        <div className={styles.keycup}>
          <span className={controls}>A</span>
          <span className={controls}>D</span>
          <span>{RageAPI.lang.get(Lang['cef.team_selector.team_control'])}</span>
        </div>
        <div className={styles.keycup}>
          <span className={controls}>W</span>
          <span className={controls}>S</span>
          <span>{RageAPI.lang.get(Lang['cef.team_selector.skin_control'])}</span>
        </div>
        <button className={styles.button}>{RageAPI.lang.get(Lang['cef.team_selector.submit'])}</button>
      </div>
    </>
  )
}

export default TeamSelector
