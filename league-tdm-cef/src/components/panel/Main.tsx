import React, { FC, useContext, useEffect, useMemo, useState } from 'react'

import { CurrentPage } from './context'

import Matches from './Pages/Matches/Matches'
import Profile from './Pages/Profile/Profile'
import Voting from './Pages/Voting/Voting'

import * as styles from './styles/panel.module.sass'
import { ClientProfile, Round } from '../../../../league-core/src/types/statistic'

interface Props {
  rounds: Round[]
  profile: ClientProfile | undefined
}

const Main: FC<Props> = ({ rounds, profile }) => {

  const { currentPage } = useContext(CurrentPage)

  const page = useMemo(() => {
    if (currentPage === 'Profile' && profile) return (<Profile profile={profile} />)
    if (currentPage === 'Matches') return (<Matches matches={rounds} name={profile?.name} id={profile?.id}/>)
    if (currentPage === 'Vote') return (<Voting />)
    if (currentPage === 'About') return (<div>About</div>)
  }, [currentPage, profile, rounds])

  return (
    <div className={styles.main}>
      {page}
    </div>
  )
}

export default Main

// {Object.entries(profile || {}).map(([key, value]: [string, any], index) => (
//     span key = { index } > { key }: { value }</span >
//   ))}