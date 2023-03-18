import React, { useEffect, useRef, useState } from 'react'
import { Events } from '../../../../league-core/src/types'
import RageAPI from '../../helpers/RageAPI'
import * as styles from './debug.module.sass'
import cls from 'classnames'
import { hhmmss } from '../../helpers/format'

const MAX_DEBUG_SIZE = 100

export default () => {
  const [active, setActive] = useState(false)
  const [messages, set] = useState<[string, string, string][]>([])

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.cef.debug_toggle'], 'debug', (active: boolean) => {
      setActive(active)
    })

    RageAPI.subscribe(Events['tdm.cef.debug'], 'debug', (a: string, type: string = 'log') => {
      const args: string[] = JSON.parse(a)

      set(prev => {
        const dateNow = hhmmss()
        const next: [string, string, string][] = args.map(input => {
          const [,now = dateNow, arg = input] = input.match(/(\d{2}:\d{2}:\d{2})(.+)/) || []
          return [now, arg.trim(), type]
        })

        prev = [...prev, ...next]
        
        if (prev.length > MAX_DEBUG_SIZE) {
          prev = prev.slice(Math.abs(MAX_DEBUG_SIZE - messages.length))
        }

        return prev
      })
    })

    return () => {
      RageAPI.unsubscribe(Events['tdm.cef.debug_toggle'], 'debug')
      RageAPI.unsubscribe(Events['tdm.cef.debug'], 'debug')
    }
  }, [])

  useEffect(() => {
    if (ref.current) ref.current?.scrollIntoView()
}, [messages, active])

  if (!active) return <></>

  return (
    <div className={styles.root}>
      {messages.map(([date, message, type], index) => (
        <div key={index} className={styles.item}>
          <span className={styles.date}>{date}</span>
          <span className={cls(styles[type])}>{message}</span>
        </div>
      ))}
      <div ref={ref} />
    </div>
  )
}