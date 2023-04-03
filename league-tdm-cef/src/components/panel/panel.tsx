import React, { useEffect, useState } from 'react'
import { CurrentPage, ShrinkNavbar } from './context'

import * as styles from './styles/panel.module.sass'

import Header from './Header'
import Main from './Main'
import Navbar from './Navbar'

import { ClientProfile, Round } from '../../../../league-core/src/types/statistic'
import RageAPI from '../../helpers/RageAPI'
import { Events } from '../../../../league-core/src/types'
import cefLog from '../../helpers/cefLog'

export default () => {

  const [currentPage, setCurrentPage] = useState<string>('Vote')
  const [shrink, setShrink] = useState<boolean>(false)

  const [active, setActive] = useState<boolean>(true)
  const [profile, setProfile] = useState<ClientProfile>()
  const [rounds, setRounds] = useState<Round[]>([])

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.cef.panel'], 'panel', (data: string | boolean) => {
      try {
        if (typeof data === 'boolean') {
          setActive(data)
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
        setActive(visible)
      } catch (err) {
        cefLog(err)
      }

      return () => {
        RageAPI.unsubscribe(Events['tdm.cef.panel'], 'panel')
      }
    })
  }, [])

  if (!active) return <></>

  // todo: 

  return (
    <div className={styles.root}>
      <CurrentPage.Provider value={{ currentPage, setCurrentPage }}>
      <ShrinkNavbar.Provider value={{ shrink, setShrink }}>
        <Header />
        <Navbar />
        <Main rounds={rounds} profile={profile}/>
      </ShrinkNavbar.Provider>
      </CurrentPage.Provider>
    </div>
  )
}