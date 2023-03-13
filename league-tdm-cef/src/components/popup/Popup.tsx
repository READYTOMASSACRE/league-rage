import React, { FC, useEffect, useMemo, useState } from 'react'
import { Events } from '../../../../league-core/src/types'
import { IMessage } from '../../types'
import * as s from './Popup.module.sass'
import PopupItem from './PopupItem/PopupItem'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { nanoid } from 'nanoid'
import RageAPI from '../../helpers/RageAPI'

const MAX_ACTIVE = 3
const ALIVE_INTERVAL = 3000

const Popup: FC = ({ }) => {
  const [messages, set] = useState<IMessage[]>([])

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.popup.push'], 'popup', (text: string, type: string = 'success') => {
      set(prev => [...prev, { text, type, active: true, alive: Date.now(), id: nanoid(10) }])
    })

    const interval = setInterval(() => set(prev => {
      const [first, ...arr] = prev
  
      if (first && Date.now() - (first.alive || 0) > ALIVE_INTERVAL) {
        return arr
      }
  
      return prev
    }), 1000)

    return () => {
      clearInterval(interval)
      RageAPI.unsubscribe(Events['tdm.popup.push'], 'popup')
    }
  }, [])

  useEffect(() => {
    set(prev => {
      if (prev.length > MAX_ACTIVE) {
        const [,...next] = prev
        return next
      }

      return prev
    })
  }, [messages.length])

  const items = useMemo(() => {
    return messages.map((message) => (
      <CSSTransition
        key={message.id}
        timeout={500}
        classNames={{
          enter: s['item-enter'],
          enterActive: s['item-enter-active'],
          exit: s['item-exit'],
          exitActive: s['item-exit-active'],
        }}
      >
        <PopupItem message={message}/>
      </CSSTransition>
    ))
  }, [messages])

  return (
    <div className={s.popup}>
      <TransitionGroup>{items}</TransitionGroup>
    </div>
  )
}

export default Popup
