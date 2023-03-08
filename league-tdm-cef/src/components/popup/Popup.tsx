import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { IMessage } from '../../types'
import * as s from './Popup.module.sass'
import PopupItem from './PopupItem/PopupItem';

const messageInfo = [
  {
    id: 1,
    title: 'problem with connection',
    type: 'error',
  },
  {
    id: 2,
    title: 'come back to the zone',
    type: 'warning',
  },
  {
    id: 3,
    title: 'change side',
    type: 'common',
  },
  {
    id: 4,
    title: 'mat\' zhiva???',
    type: 'common',
  },
  {
    id: 5,
    title: 'u must do somethings... idk what u can write in the message',
    type: 'info',
  },
  {
    id: 6,
    title: 'last round',
    type: 'info'
  },
  {
    id: 7,
    title: 'you\'r lvl is 100, touch grass bro wtf',
    type: 'success'
  },
  {
    id: 8,
    title: 'not enough players to start',
    type: 'error'
  },
  {
    id: 9,
    title: '100 kill, touch grass bro wtf',
    type: 'success'
  }
]

const oneMessageInfo = {
  id: 5,
  title: 'u must do somethings... idk what u can write in the message',
  type: 'info'
}

const Popup: FC = ({ }) => {

  const [message, setMessage] = useState<IMessage>({ id: 0, title: '', type: '' })
  const [active, setActive] = useState<boolean>(true)
  const [queueMessages, setQueueMessages] = useState<IMessage[]>([])
  const [currentMessages, setCurrentMessages] = useState<IMessage[]>([])
  const [deleteMessage, setDeleteMessage] = useState<number>(-1)

  const popupItemRef = useRef(null)

  const [i, setI] = useState<number>(0)

  // useEffect(() => {
  //   let timer = setTimeout(() => {
  //     if (i < 9) {
  //       setMessage(messageInfo[i])
  //       setI(prev => prev + 1)
  //     }
  //   }, 1000)

  //   return () => clearTimeout(timer)
  // }, [i])

  useEffect(() => {
    setQueueMessages(prev => [...prev, message])
  }, [message])

  useEffect(() => {
    setCurrentMessages(prev => [...prev.filter(e => e.id !== deleteMessage)])
  }, [deleteMessage])

  const popUpItem = useMemo(() => {
    if (queueMessages?.length !== 0) {
      if (currentMessages?.length !== 3) {
        do {
          setCurrentMessages(prev => [...prev, queueMessages[0]])
          setQueueMessages(prev => [...prev.slice(1)])
        } while (currentMessages.length === 3 || queueMessages.length === 0)
      }
    }
    return currentMessages?.map((mes) => <PopupItem key={mes.id} setDeleteMessage={setDeleteMessage} message={mes} />)
  }, [queueMessages, currentMessages])

  return (
    <div className={s.popup}>
      {popUpItem}
    </div>
  )
}

export default Popup
