import React, { useEffect, useRef, useState } from 'react'
import { Events } from '../../../../../core/src/types'
import RageAPI from '../../helpers/RageAPI'
import * as styles from './debug.module.sass'
import cls from 'classnames'
import { hhmmss } from '../../helpers/format'

const MAX_DEBUG_SIZE = 100

type DebugMessage = [string, string, string]

export default () => {
  const [active, setActive] = useState(false)
  const [messages, set] = useState<DebugMessage[]>([])

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.cef.debug_toggle'], 'debug', (active: boolean) => {
      setActive(active)
    })

    const addError = (prev: DebugMessage[], err: Error) => {
      const error: DebugMessage = [hhmmss(), err?.stack || err.message, 'fatal']

      prev = [...prev, error]

      if (prev.length > MAX_DEBUG_SIZE) {
        prev = prev.slice(Math.abs(MAX_DEBUG_SIZE - messages.length))
      }

      return prev
    }

    RageAPI.subscribe(Events['tdm.cef.debug'], 'debug', (a: string, type: string = 'log') => {
      try {
        const args: string[] = JSON.parse(a)
  
        set(prev => {
          try {
            if (!args.length) return []
  
            const dateNow = hhmmss()
            const next: [string, string, string][] = args.map((input) => {
              input = String(input)

              const [,now = dateNow, arg = input] = input.match(/(\d{2}:\d{2}:\d{2})(.+)/) || []
              return [now, arg.trim(), type]
            })
    
            prev = [...prev, ...next]
            
            if (prev.length > MAX_DEBUG_SIZE) prev.shift()
    
            return prev
          } catch (err) {

            return addError(prev, err as Error)
          }
        })
      } catch (err) {
        set(prev => addError(prev, err as Error))
      }
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