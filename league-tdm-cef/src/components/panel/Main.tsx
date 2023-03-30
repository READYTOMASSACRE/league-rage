import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Events } from '../../../../league-core/src/types'
import { ClientProfile, Round } from '../../../../league-core/src/types/statistic'
import cefLog from '../../helpers/cefLog'
import RageAPI from '../../helpers/RageAPI'
import { Active, CurrentPage } from './context'
import Games from './Pages/Games'
import Profile from './Pages/Profile'

import * as styles from './styles/panel.module.sass'

const data = {
  id: '2222',
  lvl: 285,
  exp: 285000,
  kill: 891,
  death: 322,
  assists: 412,
  damageDone: 65489,
  damageRecieved: 22487,
  hit: 2341,
  name: 'ZXCAndruha1488',
}

const dataM = [
  {arenaId: 'arena 11', kda: 32, id: 1233233333},
  {arenaId: 'arena 23', kda: 4, id: 1233214444},
]

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
    if (currentPage === 'Profile' && profile) return (<Profile profile={data} matches={rounds.length} />)
    if (currentPage === 'Games') return (<Games matches={rounds} name={'ZXCAndruha1488'}/>)
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

// {Object.entries(profile || {}).map(([key, value]: [string, any], index) => (
//     span key = { index } > { key }: { value }</span >
//   ))}