import React, { FC } from 'react'

import * as styles from '../../styles/panel.module.sass'
import cl from 'classnames'

interface Props {
  title: string
  current: string
  setCategory:(value: string) => void
}

const VotingCategoryItem: FC<Props> = ({ title, current, setCategory }) => {

  return (
    <div className={cl(styles.votingCategoryItem, current === title && styles.current)} onClick={() => setCategory(title)}>
      {title}
    </div>
  )
}

export default VotingCategoryItem
