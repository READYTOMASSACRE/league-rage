import React, { FC } from 'react'
import { Arena } from '../../../../../../league-core/src/types/tdm'

import * as styles from '../../styles/panel.module.sass'

interface Props {
  arenas?: Arena[]
}

const Voting: FC<Props> = ({ arenas }) => {

  return (
    <div className={styles.voting}>
      <div className={styles.votingTop}>

      </div>
      <div className={styles.votingCenter}>

      </div>
    </div>
  )
}

export default Voting
