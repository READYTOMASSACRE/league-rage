import React, { FC } from 'react'
import cl from 'classnames'
import * as s from './TeamItem.module.sass'

interface Props {
  children?: | JSX.Element | JSX.Element | React.ReactNode;
  side: string;
}

const TeamItem: FC<Props> = ( {children, side} ) => {

  return (
    <div tabIndex={-1} className={cl(s.teamItem, side === 'left' ? s.left : s.right)}>
      {children}
    </div>
  )
}

export default TeamItem
