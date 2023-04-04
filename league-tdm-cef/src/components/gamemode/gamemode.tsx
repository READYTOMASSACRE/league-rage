import React, { useEffect, useState } from 'react'
import * as styles from './gamemode.module.sass'
import RageAPI from '../../helpers/RageAPI'
import { Events } from '../../../../league-core/src/types'
import cefLog from '../../helpers/cefLog'

export default () => {
  const [text, set] = useState('League 0.6a')

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.cef.gamemode'], 'gamemode', (text: string) => {
      cefLog(text)
      set(text)
    })

    return () => RageAPI.unsubscribe(Events['tdm.cef.gamemode'], 'gamemode')
  }, [])
  return <span className={styles.root}>{text}</span>
}