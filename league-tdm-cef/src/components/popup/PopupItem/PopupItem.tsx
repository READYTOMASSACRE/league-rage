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
const textShadow = {
  info: '0 0 1px black, 2px 2px #0b33649c',
  success: '0 0 1px black, 2px 2px #0b641a9c',
  error: '0 0 1px black, 2px 2px #640b0b9c',
  warning: '0 0 1px black, 2px 2px #64510b9c',
  common: '0 0 1px black, 2px 2px #4242429c'
}

const PopupItem: FC<Props> = ({ message }) => {
  const style: React.CSSProperties = {
    backgroundColor: color[message.type],
    textShadow: textShadow[message.type],
  }

  return (
    <div style={style} className={s.popupitem}>
      {message.text}
    </div>
  )
}

export default PopupItem
