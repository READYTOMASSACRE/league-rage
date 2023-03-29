import React, { useState, useEffect } from 'react'
import { Events } from '../../../../league-core/src/types'
import { CurrentPlayer } from '../../../../league-core/src/types/spectate'
import cefLog from '../../helpers/cefLog'
import RageAPI from '../../helpers/RageAPI'
import * as styles from './spectate.module.sass'

export default () => {
  const [current, set] = useState<CurrentPlayer>()

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.cef.spectate'], 'spectate', (data: string) => {
      try {
        set(JSON.parse(data))
      } catch (err) {
        cefLog(err)
      }

      return () => RageAPI.unsubscribe(Events['tdm.cef.spectate'], 'spectate')
    })
  }, [])

  if (!current) return <></>

  return (
    <div className={styles.root}>
      <span className={styles.nickname}>{current.name}</span>
      <div className={styles.kda}>
        <span>ID {current.id}</span>
        <span>K {current.kill}</span>
        <span>D {current.death}</span>
        <span>A {current.assists}</span>
      </div>
      <div className={styles.controls}>
        <div>Сменить игрока</div>
        <div><span>A</span>Влево</div>
        <div><span>D</span>Вправо</div>
      </div>
    </div>
  )
}