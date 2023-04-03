import React, { FC, useState } from 'react'

import * as styles from '../../styles/panel.module.sass'

interface Props {
  title?: string
  id?: number | string
}

const VotingItem: FC<Props> = ({ title, id }) => {

  const [hover, set] = useState<boolean>(false)

  return (
    <div className={styles.votingItem} onMouseEnter={() => set(true)} onMouseLeave={() => set(false)}>{hover ? 'Voting' : title}</div>
  )
}

export default VotingItem
