import React, { FC, useMemo, useState } from 'react'
import { Round } from '../../../../../../league-core/src/types/statistic'

import * as styles from '../../styles/panel.module.sass'
import MatchItem from './MatchItem'
import RageAPI from '../../../../helpers/RageAPI'
import { Lang } from '../../../../../../league-lang/language'

interface Props {
  matches: Round[]
  name?: string
  id?: string
}

const Games: FC<Props> = ({ matches, name, id }) => {

  const [currentPage, setCurrentPage] = useState(1)
  const [elementsPerPage, setElementsPerPage] = useState(12)

  const pages = useMemo(() => {
    const arr = new Array

    for (let i = 1; i <= Math.ceil(matches.length / elementsPerPage); i++) {
      arr.push(i)
    }

    return arr;
  }, [matches])

  const visibleMatches = useMemo(() => {
    const last = currentPage * elementsPerPage
    const first = last - elementsPerPage
    const arr = matches.slice(first, last) 
    
    return arr;
  }, [currentPage])

  return (
    <div className={styles.matches}>
      <h1>{RageAPI.lang.get(Lang['cef.panel.matches_title'])}</h1>
      <div className={styles.matchItem}>
        <span>Name</span>
        <span>Arena</span>
        <span>K/D/A</span>
        <span>Date</span>
      </div>
      <div className={styles.matchesList}>
        {visibleMatches.map((match) => (
          <MatchItem key={match.id} name={name} match={match} id={id} />
        ))}
      </div>
      <div className={styles.pagination}>
        {pages.map((page) => (
          <span className={currentPage === page && styles.current} key={page} onClick={() => setCurrentPage(page)}>
            {page}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Games
