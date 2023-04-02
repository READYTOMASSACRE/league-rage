import React, { FC } from 'react'
import { Round } from '../../../../../../league-core/src/types/statistic'

import * as styles from '../../styles/panel.module.sass'

interface Props {
  match: Round
  name: string | undefined
}

const MatchItem: FC<Props> = ({match, name}) => {
  return (
    <div>
      <div className={styles.matchItem}>
            <span>{name}</span>
            <span>{match.arenaId}</span>
            <span>5</span>
            <span>{(new Date(match.id).toDateString())}</span>
          </div>
    </div>
  )
}

export default MatchItem
