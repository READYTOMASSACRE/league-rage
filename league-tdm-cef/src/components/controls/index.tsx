import React, { useEffect, useState } from 'react'
import { cef, Events } from '../../../../league-core/src/types'
import cefLog from '../../helpers/cefLog'
import RageAPI from '../../helpers/RageAPI'
import styles from './controls.module.sass'
import cls from 'classnames'

export default () => {
  const [controls, setControls] = useState<cef.Control[]>([])

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.controls.data'], 'controls', (data: string) => {
      try {
        setControls(JSON.parse(data))
      } catch (err) {
        cefLog(err)
      }
    })

    return () => RageAPI.unsubscribe(Events['tdm.controls.data'], 'controls')
  }, [])

  const keyClasses = {
    1: styles.key,
    2: cls(styles.key, styles.medium),
    default: cls(styles.key, styles.large),
  }

  return (
    <div className={styles.root}>
      {controls.map((control, key) => {
        return (
          <div className={styles.item} key={key}>
            <div className={keyClasses[control.key.length] || keyClasses.default}>
              <span>{control.key}</span>
            </div>
            <span className={styles.desc}>{control.description}</span>
          </div>
        )
      })}
    </div>
  )
}