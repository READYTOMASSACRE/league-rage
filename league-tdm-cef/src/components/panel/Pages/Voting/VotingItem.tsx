import React, { FC } from 'react'

import * as styles from '../../styles/panel.module.sass'

interface Props {
  title?: string
  id?: number | string
}

const VotingItem: FC<Props> = ({ title, id }) => {
  return (
    <span className={styles.votingItem}>{title}</span>
  )
}

export default VotingItem
