import React, { useEffect, useState } from 'react'
import { Events } from '../../../../../core/src/types'
import RageAPI from '../../helpers/RageAPI'
import * as styles from './motd.module.sass'

export default () => {
  const [[gamemode, html, active], set] = useState(['', '', false])

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.cef.motd'], 'motd', (html: string, gamemode: string = 'League', toggle?: boolean) => {
      set([gamemode, html, Boolean(toggle)])
    })

    return () => RageAPI.unsubscribe(Events['tdm.cef.motd'], 'motd')
  }, [])

  if (!active) return <></>

  return (
    <div className={styles.root}>
      <span className={styles.gamemode}>{gamemode}</span>
      <div className={styles.motd} dangerouslySetInnerHTML={{ __html: html }} />
      <button className={styles.button} onClick={() => RageAPI.motdClose()}>OK</button>
    </div>
  )
}