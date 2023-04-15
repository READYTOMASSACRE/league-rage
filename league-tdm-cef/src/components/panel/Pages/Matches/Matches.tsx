import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Round } from '../../../../../../league-core/src/types/statistic'

import * as styles from '../../styles/panel.module.sass'
import MatchItem from './MatchItem'
import RageAPI from '../../../../helpers/RageAPI'
import { Lang } from '../../../../../../league-lang/language'

interface Props {
  matches: Round[]
  name?: string
  id?: string
  amount?: number
}

const Games: FC<Props> = ({ matches, name, id, amount }) => {

  const [currentPage, setCurrentPage] = useState(1)
  const [elementsPerPage, setElementsPerPage] = useState<undefined | number>(undefined)
  const [[from, to], setRange] = useState<[number | undefined, number | undefined]>([undefined, undefined])

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      let height = ref.current.offsetHeight
      let el = ((height / 35) - 1)
      setElementsPerPage(el)
    }
  }, [])

  const pages = useMemo(() => {
    const arr = new Array

    if (amount && elementsPerPage) {
      for (let i = 1; i <= Math.ceil(amount / elementsPerPage); i++) {
        arr.push(i)
      }
    }

    return arr;
  }, [amount, elementsPerPage])

  useEffect(() => {
    if (currentPage && elementsPerPage) {
      const last = currentPage * elementsPerPage
      const first = last - elementsPerPage
      setRange([first, last])
    }
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
      <div className={styles.matchesList} ref={ref}>
        {matches.map((match, index) => (
          <MatchItem key={match.id} name={name} match={match} id={id} />
        ))}
      </div>
      <div className={styles.pagination}>
        {pages.map((page) => (
          <div className={currentPage === page ? styles.current : ''} key={page} onClick={() => setCurrentPage(page)}>
            {page}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Games
