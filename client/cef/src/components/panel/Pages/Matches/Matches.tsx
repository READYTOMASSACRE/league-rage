import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ListReponse, Round } from '../../../../../../../core/src/types/statistic'

import * as styles from '../../styles/panel.module.sass'
import MatchItem from './MatchItem'
import RageAPI from '../../../../helpers/RageAPI'
import { Lang } from '../../../../../../../lang/language'
import { Events } from '../../../../../../../core/src/types'
import cefLog from '../../../../helpers/cefLog'

interface Props {
  name?: string
  id?: string
  amount?: number
}

const Games: FC<Props> = ({ name, id, amount }) => {

  const [matches, setMatches] = useState<Round[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [elementsPerPage, setElementsPerPage] = useState<undefined | number>(undefined)
  const [[from, to], setRange] = useState<[number | undefined, number | undefined]>([undefined, undefined])

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.cef.match.request'], 'matches', (payload: string) => {
      try {
        const {list, total}: ListReponse<Round> = JSON.parse(payload)

        // RageAPI.matchRequest({ limit: 20, offset: 0 }) match request
      } catch (err) {
        cefLog(err)
      }
    })

    return () => RageAPI.unsubscribe(Events['tdm.cef.match.request'], 'matches')
  }, [])

  useEffect(() => {
    if (ref.current) {
      let height = ref.current.offsetHeight
      let el = ((height / 35) - 1)
      setElementsPerPage(el)
    }
  }, [ref])

  const pages = useMemo(() => {
    const arr = new Array

    if (amount && elementsPerPage) {
      if(amount > elementsPerPage)
      for (let i = 1; i <= Math.ceil(amount / elementsPerPage); i++) {
        arr.push(i)
      } else {
        arr.push(1)
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

  useEffect(() => {
    if (from && to) {
      // RageApi, setMathces
    }
  }, [from, to])

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
        {(amount === 0 || undefined) ?
          <h1>Нет данных</h1> :
          matches.length ? matches.map((match) => (
            <MatchItem key={match.id} name={name} match={match} id={id} />
          )) : <h1>Загрузка...</h1>
        }
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
