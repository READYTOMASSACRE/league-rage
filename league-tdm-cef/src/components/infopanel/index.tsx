import React, { useMemo, useState } from 'react'
import { toColor } from '../../../../league-core/src/helpers'
import { cef, Events } from '../../../../league-core/src/types'
import cefLog from '../../helpers/cefLog'
import RageAPI from '../../helpers/RageAPI'
import * as styles from './infopanel.module.sass'
import cls from 'classnames'

export default () => {
  const [active, setActive] = useState(false)
  const [data, setData] = useState<cef.InfoPanel>()

  React.useEffect(() => {
    RageAPI.subscribe(Events['tdm.infopanel.data'], 'infopanel', (d: string, toggle: boolean) => {
      try {
        setData(JSON.parse(d))
        setActive(toggle)
      } catch (err) {
        cefLog(err)
      }
    })
    return () => {
      RageAPI.unsubscribe(Events['tdm.infopanel.data'], 'infopanel')
    }
  }, [])

  const [timeleftColor, timeleftText] = useMemo(() => {
    if (typeof data?.timeleft !== 'number') {
      return ['white', '00:00']
    }

    const minutes = Math.floor(data.timeleft / 60)
    const seconds = data.timeleft - (minutes * 60)

    if (seconds < 0) {
      return ['white', '00:00']
    }

    const color = minutes < 1 && seconds < 30 && data.timeleft > 0 ? '#f15151' : 'white'
    return [color, `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2,'0')}`]
  }, [data?.timeleft])

  return (
    <div className={active ? styles.root : cls(styles.root, styles.hidden)}>
      <div className={styles.team} style={{ color: toColor(data?.attackers.color) }}>
        <span>{data?.attackers?.name}</span>
        <span>{data?.attackers?.score}</span>
      </div>
      {(
        <div className={styles.round}>
          <span>{data?.arena}</span>
          <span style={{ color: timeleftColor }}>{timeleftText}</span>
        </div>
      )}
      <div className={styles.team} style={{ color: toColor(data?.defenders.color) }}>
        <span>{data?.defenders.score}</span>
        <span>{data?.defenders.name}</span>
      </div>
    </div>
  )
}