import React, { FC } from 'react'
import { Round } from '../../../../../league-core/src/types/statistic'

import * as styles from '../styles/panel.module.sass'

interface Props {
  matches: Round[]
  name: string | undefined
}

const Games: FC<Props> = ({matches, name}) => {
  return (
    <div className={styles.games}>
        <div className={styles.gamesItem}>
          <span>Name</span>
          <span>Arena</span>
          <span>K/D/A</span>
          <span>Date</span>
        </div>
        {matches.map((match, index) => (
          <div className={styles.gamesItem}>
            <span>{name}</span>
            <span>{match.arenaId}</span>
            <span>5</span>
            <span>{(new Date(match.id).toDateString())}</span>
          </div>
        ))}
      </div>
  )
}

export default Games
