import React, { FC, useMemo, useState } from 'react'
import { Arena } from '../../../../../../league-core/src/types/tdm'

import * as styles from '../../styles/panel.module.sass'

import VotingCategoryItem from './VotingCategoryItem'
import VotingItem from './VotingItem'
import RageAPI from '../../../../helpers/RageAPI'
import { Lang } from '../../../../../../league-lang/language'

interface Props {
  arenas?: Record<number, Arena>
}

const Voting: FC<Props> = ({ arenas }) => {
  const [currentCategory, setCurrentCategory] = useState('')

  const items = useMemo(() => {
    if (!arenas) return []

    return Object.entries(arenas).map(([id, arena]) => {
      return <VotingItem key={id} id={id} title={arena.code}/>
    })
  }, [arenas])

  const voteCategory = [
    RageAPI.lang.get(Lang['cef.panel.vote_arena']),
    RageAPI.lang.get(Lang['cef.panel.vote_base']),
    RageAPI.lang.get(Lang['cef.panel.vote_player']),
  ]

  return (
    <div>
      <h1>{RageAPI.lang.get(Lang['cef.panel.vote_title'])}</h1>
      <div className={styles.voting}>
        <div className={styles.votingTop}>
          {voteCategory.map((category) => (
            <VotingCategoryItem
              key={category}
              setCategory={setCurrentCategory}
              current={currentCategory}
              title={category}
            />
          ))}
        </div>
        <div className={styles.votingCenter}>
          {items}
        </div>
      </div>
    </div>
  )
}

export default Voting
