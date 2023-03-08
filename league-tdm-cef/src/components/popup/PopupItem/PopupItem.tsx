import React, { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { IMessage } from '../../../types'
import * as s from './PopupItem.module.sass'

interface Props {
  message: IMessage;
}

const color = {
  info: '#1b57b1',
  success: '#1bb16b',
  error: '#b11b1b',
  warning: '#aeb11b',
  common: '#5c5c5c'
}

const PopupItem: FC<Props> = ({ message }) => {
  const style: React.CSSProperties = {
    backgroundColor: `${color[message.type]}`,
    opacity: message.active ? 1 : 0,
  }

  return (
    <div style={style} className={s.popupitem}>
      <div className={s.title}>
        {message.text}
      </div>
    </div>
  )
}

export default PopupItem
