import React, { FC } from 'react'
import cl from 'classnames'
import s from './ListOfPlayers.module.sass'

interface Props {
  children?: | JSX.Element | JSX.Element[] | string | string[] | React.ReactNode;
}

const ListOfPlayers: FC<Props> = ({ children }) => {
  // add scrollbar
  return (
    <div className={cl(s.listOfPlayers)}>
      {children}
    </div>
  )
}

export default ListOfPlayers;