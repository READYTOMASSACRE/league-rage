import React, { FC, useState } from 'react'

import * as styles from '../../styles/panel.module.sass'
import RageAPI from '../../../../helpers/RageAPI'

interface Props {
  title: string
  id: number | string
}

const VotingItem: FC<Props> = ({ title, id }) => {

  const [hover, set] = useState<boolean>(false)

  return (
    <div
      className={styles.votingItem}
      onMouseEnter={() => set(true)}
      onMouseLeave={() => set(false)}
      onClick={() => RageAPI.voteArenaRequest(id)}
    >{hover ? 'Vote' : title}</div>
  )
}

export default VotingItem
