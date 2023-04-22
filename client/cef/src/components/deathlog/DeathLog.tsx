import React, { FC, useEffect, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import * as s from './DeathLog.module.sass'
import DeathLogItem from './DeathLogItem'
import { deathlog, Events } from '../../../../../core/src/types'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import RageAPI from '../../helpers/RageAPI'
import cefLog from '../../helpers/cefLog'

const ALIVE = 3000

const DeathLog: FC = ({ }) => {

  const [log, setLog] = useState<deathlog.DeathLogData[]>([])

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.player.kill'], 'deathlog', (data: string) => {
      try {
        const deathlog = JSON.parse(data)
        setLog(prev => [{ deathlog, alive: Date.now(), id: nanoid(10)}, ...prev])
      } catch (err) {
        cefLog(err)
      }
    })

    return () => {
      RageAPI.unsubscribe(Events['tdm.player.kill'], 'deathlog')
    }
  }, [])

  useEffect(() => {
    if (!log.length) return

    const timeout = setTimeout(() => {
      setLog(prev => [...prev.filter(item => Date.now() - item.alive < ALIVE)])
    }, 1000)

    return () => clearTimeout(timeout)
  }, [log])

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