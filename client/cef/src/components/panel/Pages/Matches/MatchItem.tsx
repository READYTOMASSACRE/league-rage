import React, { FC } from 'react'
import { Round } from '../../../../../../../core/src/types/statistic'

import * as styles from '../../styles/panel.module.sass'

interface Props {
  match: Round
  name?: string
  id?: string
}

const MatchItem: FC<Props> = ({ match, name, id }) => {

  if (!id) return <></>

  const stats = match.defenders.players[id] ?? match.attackers.players[id]

  if (!stats) return <></>

  const { kda = 0 } = stats

  return (
    <div className={styles.matchItem}>
      <span>{name}</span>
      <span>{match.arenaId}</span>
      <span>{kda}</span>
      <span>{(new Date(match.id).toDateString())}</span>
    </div>
  )
}

export default MatchItem
