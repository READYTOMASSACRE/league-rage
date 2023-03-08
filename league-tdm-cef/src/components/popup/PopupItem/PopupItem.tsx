import React, { FC } from 'react'
import { IMessage } from '../../../types'
import * as s from './PopupItem.module.sass'

interface Props {
  message: IMessage
}

const color = {
  info: '#1b57b194',
  success: '#0aa15b94',
  error: '#d3323294',
  warning: '#cfc52f94',
  common: '#5c5c5c94'
}

const PopupItem: FC<Props> = ({ message }) => {
  const style: React.CSSProperties = {
    backgroundColor: `${color[message.type]}`,
  }

  return (
    <div style={style} className={s.popupitem}>
      {message.text}
    </div>
  )
}

export default PopupItem
