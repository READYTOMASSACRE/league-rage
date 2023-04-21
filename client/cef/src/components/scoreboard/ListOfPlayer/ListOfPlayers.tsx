import React, { FC, useEffect, useRef } from 'react'
import cl from 'classnames'
import * as s from './ListOfPlayers.module.sass'

interface Props {
  children?: | JSX.Element | JSX.Element[] | string | string[] | React.ReactNode;
}

const ListOfPlayers: FC<Props> = ({ children }) => {
  
  const listOfPlayerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={listOfPlayerRef} className={cl(s.listOfPlayers)}>
      {children}
    </div>
  )
}

export default ListOfPlayers;