import React, { useEffect, useState } from 'react'
import { Events } from '../../../../league-core/src/types'
import RageAPI from '../../helpers/RageAPI'
import * as styles from './notifytext.module.sass'
import cls from 'classnames'
import cefLog from '../../helpers/cefLog'
import { nanoid } from 'nanoid'

export default () => {
  const [items, set] = useState<[string, string][]>([])

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.notify.text'], 'notifytext', (items: string) => {
      try {
        set(JSON.parse(items))
      } catch(err) {
        cefLog(err)
      }
    })

    return () => RageAPI.unsubscribe(Events['tdm.notify.text'], 'notifytext')
  }, [])

  return (
    <div className={styles.root}>
      {Array.isArray(items) && items.map(([text, template]) => {
        return (
          <span key={nanoid(10)} className={cls(styles.item, styles[template] || styles.default)}>
            {text}
          </span>
        )
      })}
    </div>
  )
}