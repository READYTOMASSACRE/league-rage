import React, { FC, useEffect, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import * as s from './DeathLog.module.sass'
import DeathLogItem from './DeathLogItem'
import { deathlog } from '../../../../league-core/src/types'
import { TransitionGroup, CSSTransition } from 'react-transition-group'


const ALIVE = 3000

const DeathLog: FC = ({ }) => {

  const [log, setLog] = useState<deathlog.DeathLogData[]>([])

  useEffect(() => {

    // setLog(prev => [{ deathlog: data, alive: Date.now(), id: nanoid(10)}, ...prev])

    const interval = setInterval(() => {
      setLog(prev => [...prev.filter(item => Date.now() - item.alive < ALIVE)])
    }, 100)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const items = useMemo(() => {
    return log.map((item) => (
      <CSSTransition
        key={item.id}
        timeout={500}
        classNames={{
          exit: s['item-exit'],
          exitActive: s['item-exit-active'],
        }}>
        <DeathLogItem data={item.deathlog} />
      </CSSTransition>
    ))
  }, [log])

  return (
    <div className={s.container}>
      <TransitionGroup>
        {items}
      </TransitionGroup>
    </div>
  )
}

export default DeathLog