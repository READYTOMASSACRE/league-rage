import React, { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { IMessage } from '../../../types'
import * as s from './PopupItem.module.sass'

interface Props {
  message: IMessage;
  setDeleteMessage: (id: number) => void;
}

const color = {
  info: '#1b57b1',
  success: '#1bb16b',
  error: '#b11b1b',
  warning: '#aeb11b',
  common: '#5c5c5c'
}

const PopupItem: FC<Props> = ({ message, setDeleteMessage }) => {

  const [active, setActive] = useState<boolean>(false)
  const div = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setActive(true)

    let timerSetVisible = setTimeout(() => {
      setActive(false)
      setDeleteMessage(message.id)
    }, 3000)

    return () => {
      clearTimeout(timerSetVisible);
    }
  }, [])

  return (
    <div ref={div}
      style={{
        backgroundColor: `${color[message.type]}`,
        visibility: active ? 'visible' : 'hidden'
      }}
      className={s.popupitem}
    >
      <div></div>
      {/* <div className={s.type}>
        {message.type}
      </div> */}
      <div className={s.title}>
        {message.title}
      </div>
    </div>
  )
}

export default PopupItem
