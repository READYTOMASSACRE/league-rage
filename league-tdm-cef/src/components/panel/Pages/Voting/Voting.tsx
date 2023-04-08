import React, { FC, useMemo, useState } from 'react'
import { Arena } from '../../../../../../league-core/src/types/tdm'

import * as styles from '../../styles/panel.module.sass'

import VotingCategoryItem from './VotingCategoryItem'
import VotingItem from './VotingItem'

interface Props {
  arenas?: Record<number, Arena>
}

const voteCategory = [
  {title: 'Arenas'},
  {title: 'Bases'},
  {title: 'Players'},
]

const arenasData = [
  {name: 'arena 0'},
  {name: 'arena 1'},
  {name: 'arena 2'},
  {name: 'arena 3'},
  {name: 'arena 4'},
  {name: 'arena 5'},
  {name: 'arena 6'},
  {name: 'arena 7'},
  {name: 'arena 8'},
  {name: 'arena 9'},
  {name: 'arena 10'},
]

const Voting: FC<Props> = ({ arenas }) => {

  const [currentCategory, setCurrentCategory] = useState('')

  const items = useMemo(() => {
    if (!arenas) return []

    return Object.entries(arenas).map(([id, arena]) => {
      return <VotingItem key={id} id={id} title={arena.code}/>
    })
  }, [arenas])

  return (
    <div className={styles.voting}>
      <div className={styles.votingTop}>
        {voteCategory.map((category) => <VotingCategoryItem key={category.title} setCategory={setCurrentCategory} current={currentCategory} title={category.title}/>)}
      </div>
      <div className={styles.votingCenter}>
        {items}
      </div>
    </div>
  )
}

export default Voting
