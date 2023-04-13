import React, { FC } from 'react'
import { Round } from '../../../../../../league-core/src/types/statistic'

import * as styles from '../../styles/panel.module.sass'
import MatchItem from './MatchItem'
import RageAPI from '../../../../helpers/RageAPI'
import { Lang } from '../../../../../../league-lang/language'

interface Props {
  matches: Round[]
  name?: string
  id?: string
}

const Games: FC<Props> = ({ matches, name, id }) => {
  return (
    <div className={styles.matches}>
      <h1>{RageAPI.lang.get(Lang['cef.panel.matches_title'])}</h1>
      <div className={styles.matchItem}>
        <span>Name</span>
        <span>Arena</span>
        <span>K/D/A</span>
        <span>Date</span>
      </div>
      {matches.map((match) => (
        <MatchItem key={match.id} name={name} match={match} id={id} />
      ))}
    </div>
  )
}

export default Games
