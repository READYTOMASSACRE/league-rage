import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { Events } from '../../../../league-core/src/types'
import { IMessage } from '../../types'
import * as s from './Popup.module.sass'
import PopupItem from './PopupItem/PopupItem'

const MAX_LENGTH = 10
const MAX_ACTIVE = 3
const ALIVE_INTERVAL = 3000

const Popup: FC = ({ }) => {
  const [messages, set] = useState<IMessage[]>([])

  const maxActive = () => set(prev => {
    const arr = [...prev]
    const active = arr.filter(item => item.active)

    if (active.length > MAX_ACTIVE) {
      const slice = MAX_ACTIVE - active.length - 1
      for (const item of active.slice(0, slice > 0 ? slice : 1)) {
        item.active = false
      }
    }

    return arr
  })

  const unshiftFirst = () => set(prev => {
    const arr = [...prev]

    for (const first of arr.filter(item => item.active)) {
      first.active = false
      break
    }

    if (arr.length > MAX_LENGTH) {
      return arr.slice(-MAX_ACTIVE -1)
    }

    return arr
  })

  useEffect(() => {
    mp.events.add(Events['tdm.chat.push'], (text: string) => {
      set(prev => [...prev, { text, type: 'success', active: true }])
    })
  }, [])

  useEffect(() => {
    maxActive()
    setTimeout(unshiftFirst, ALIVE_INTERVAL)
  }, [messages.length])

  const items = useMemo(() => {
    return messages.map((message, index) => <PopupItem key={index} message={message}/>)
  }, [messages])

  return (
    <div className={s.popup}>
      {items}
    </div>
  )
}

export default Popup
