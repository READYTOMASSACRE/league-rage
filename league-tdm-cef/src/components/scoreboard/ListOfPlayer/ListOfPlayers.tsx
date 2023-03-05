import React, { FC, useEffect, useRef } from 'react'
import cl from 'classnames'
import s from './ListOfPlayers.module.sass'

interface Props {
  children?: | JSX.Element | JSX.Element[] | string | string[] | React.ReactNode;
}

const ListOfPlayers: FC<Props> = ({ children }) => {
  
  const listOfPlayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
console.log(listOfPlayerRef.current)
  }, [listOfPlayerRef])

  return (
    <div ref={listOfPlayerRef} className={cl(s.listOfPlayers)}>
      {children}
    </div>
  )
}

export default ListOfPlayers;