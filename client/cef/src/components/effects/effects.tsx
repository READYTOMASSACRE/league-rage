import React, { useEffect, useMemo, useState } from 'react'
import RageAPI from '../../helpers/RageAPI'
import { Events } from '../../../../league-core/src/types'
import * as styles from './effects.module.sass'
import { nanoid } from 'nanoid'
import { toMs } from '../../../../league-core/src/helpers'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

type Effect = [string, string, number]
const keepAlive = 5

export default () => {
  const [effects, set] = useState<Effect[]>([])

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.cef.effects'], 'effects', (effect?: string, alive: number = keepAlive) => {
      if (effect) {
        set(prev => [...prev, [effect, nanoid(10), Date.now() + toMs(alive)]])
      } else {
        set([])
      }
    })

    return () => {
      RageAPI.unsubscribe(Events['tdm.cef.effects'], 'effects')
    }
  }, [])

  useEffect(() => {
    if (!effects.length) return

    const timeout = setTimeout(() => set(prev => {
      const now = Date.now()
      return prev.filter(([,,alive]) => alive > now)
    }), 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [effects])

  const items = useMemo(() => {
    return effects.map(([effect, id]) => {
      let item: JSX.Element | undefined = undefined

      if (effect === 'kill') {
        item = <div className={styles.kill}/>
      }

      if (!item) return <></>

      return (
        <CSSTransition
          key={id}
          timeout={500}
          classNames={{
            enter: styles['item-enter'],
            enterActive: styles['item-enter-active'],
            exit: styles['item-exit'],
            exitActive: styles['item-exit-active'],
          }}
        >{item}</CSSTransition>
      )
    })
  }, [effects])

  return <TransitionGroup>{items}</TransitionGroup>
}