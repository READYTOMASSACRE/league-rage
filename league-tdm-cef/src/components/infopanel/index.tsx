import React, { useMemo, useState } from 'react'
import { toColor } from '../../../../league-core/src/helpers'
import { cef, Events } from '../../../../league-core/src/types'
import cefLog from '../../helpers/cefLog'
import RageAPI from '../../helpers/RageAPI'
import styles from './infopanel.module.sass'
import cls from 'classnames'

export default () => {
  const [active, setActive] = useState(false)
  const [data, setData] = useState<cef.InfoPanel>()
  const [timeleft, setTimeleft] = useState(0)

  React.useEffect(() => {
    RageAPI.subscribe(Events['tdm.infopanel.data'], 'infopanel', (d: string, toggle: boolean) => {
      try {
        const _data = JSON.parse(d)

        setData({ round: { arena: 'zero_arena', time: '00:00' }, ..._data })
        setActive(toggle)
        setTimeleft(_data.timeleft || 0)

      } catch (err) {
        cefLog(err)
      }
    })
    return () => {
      RageAPI.unsubscribe(Events['tdm.infopanel.data'], 'infopanel')
    }
  }, [])

  React.useEffect(() => {
    let timeout: number | undefined = undefined

    if (!data) {
      return
    }

    if (!data.pause && timeleft > 0) {
      timeout = setTimeout(() => {
        setTimeleft(prev => prev - 1)
      }, 1000)
    }

    return () => clearTimeout(timeout)
  }, [data?.pause, timeleft])

  const [timeleftColor, timeleftText] = useMemo(() => {
    const minutes = Math.floor(timeleft / 60)
    const seconds = timeleft - (minutes * 60)
    const color = minutes < 1 && seconds < 30 && timeleft > 0 ? '#f15151' : 'white'

    return [color, `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2,'0')}`]
  }, [timeleft])

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