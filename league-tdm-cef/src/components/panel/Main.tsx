import React, { FC, useContext, useEffect, useMemo, useState } from 'react'

import { CurrentPage } from './context'

import Matches from './Pages/Matches/Matches'
import Profile from './Pages/Profile/Profile'
import Voting from './Pages/Voting/Voting'

import * as styles from './styles/panel.module.sass'
import { ClientProfile, Round } from '../../../../league-core/src/types/statistic'
import { Arena } from '../../../../league-core/src/types/tdm'
import About from './Pages/About/About'

interface Props {
  rounds: Round[]
  profile: ClientProfile | undefined
  arenas?: Record<number, Arena>
}

const Main: FC<Props> = ({ rounds, profile, arenas }) => {

  const { currentPage } = useContext(CurrentPage)

  const page = useMemo(() => {
    if (currentPage === 'Profile' && profile) return (<Profile profile={profile} />)
    if (currentPage === 'Matches') return (<Matches matches={rounds} name={profile?.name} id={profile?.id} amount={57}/>)
    if (currentPage === 'Vote') return (<Voting arenas={arenas} />)
    if (currentPage === 'About') return (<About />)
  }, [currentPage, profile, rounds])

  return (
    <div className={styles.main}>
      <div className={styles.page}>{page}</div>
    </div>
  )
}

export default Main

// {Object.entries(profile || {}).map(([key, value]: [string, any], index) => (
//     span key = { index } > { key }: { value }</span >
//   ))}