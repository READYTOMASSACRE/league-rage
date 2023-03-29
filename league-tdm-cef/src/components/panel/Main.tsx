import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Events } from '../../../../league-core/src/types'
import { ClientProfile, Round } from '../../../../league-core/src/types/statistic'
import cefLog from '../../helpers/cefLog'
import RageAPI from '../../helpers/RageAPI'
import { Active, CurrentPage } from './context'

import * as styles from './styles/panel.module.sass'

const data = {
  id: '2222',
  lvl: 285,
  exp: 285000,
  kill: 891,
  death: 322,
  assists: 500,
  damageDone: 70000,
  damageRecieved: 30000,
  hit: 100000,
  name: 'sanya',
}

const Main = () => {

  const { currentPage } = useContext(CurrentPage)
  const { active, setActive } = useContext(Active)

  const [profile, setProfile] = useState<ClientProfile>()
  const [rounds, setRounds] = useState<Round[]>([])

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.cef.panel'], 'panel', (data: string | boolean) => {
      try {
        if (typeof data === 'boolean') {
          setActive && setActive(data)
          return
        }

        const {
          profile,
          rounds = [],
          visible,
        } = JSON.parse(data)

        cefLog(data)
        setProfile(profile)
        setRounds(rounds)
        setActive && setActive(visible)
      } catch (err) {
        cefLog(err)
      }

      return () => {
        RageAPI.unsubscribe(Events['tdm.cef.panel'], 'panel')
      }
    })
  }, [])

  const userId = undefined
  const dateFrom = undefined
  const dateTo = undefined

  const content = useMemo(() => {
    if (currentPage === 'Profile') return (
      <div className={styles.profile}>
        <div className={styles.profileTop}>

        </div>
        <div className={styles.profileCenter}>
            
        </div>
      </div>
    )
    if (currentPage === 'Games') return (<div>Games</div>)
    if (currentPage === 'Vote') return (<div>Voting</div>)
    if (currentPage === 'About') return (<div>About</div>)
  }, [currentPage, profile, rounds])

  return (
    <div className={styles.main}>
      {content}
    </div>
  )
}

export default Main
