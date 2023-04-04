import React, { useEffect, useMemo, useState } from 'react'
import * as styles from './winner.module.sass'
import Letter from './letter'
import { rand, randRange, toColor } from '../../../../league-core/src/helpers'
import RageAPI from '../../helpers/RageAPI'
import { Events } from '../../../../league-core/src/types'
import cefLog from '../../helpers/cefLog'

const maskLength = 10
const animationLength = 4
const keepAlive = 7000

type State = [string, string] | undefined
export default () => {
  const [[text, color] = [], set] = useState<State>()

  useEffect(() => {
    RageAPI.subscribe(Events['tdm.cef.winner'], 'winner', (text: string | undefined, color: string = '#d8c451') => {
      if (typeof text === 'string') {
        set([text, color])
      } else {
        set(void 0)
      }
    })

    return () => {
      RageAPI.unsubscribe(Events['tdm.cef.winner'], 'winner')
    }
  }, [])

  useEffect(() => {
    let timeout = 0
    if (text) timeout = setTimeout(() => set(void 0), keepAlive)

    return () => clearTimeout(timeout)
  }, [text])

  const getRand = () => new Array(maskLength).fill(0).map(() => String.fromCharCode(randRange(97, 122))).join('')

  const items = useMemo(() => {
    if (!text) return []

    const array = text.split('')

    return array.map((letter, index) => {
      const content = getRand()
      const random = randRange(1, content.length)
      const steps = random - 1 > 0 ? random - 1 : 1
      const offset = `${steps * -1}em`
      const delay = rand(100) / 100
      const duration = +Number(steps * (animationLength / random)).toFixed(2)

      return (
        <Letter
          key={index}
          color={toColor(color)}
          animation={`letter${index}`}
          className={styles.letter}
          offset={offset}
          offsetTo={'0em'}
          delay={`${delay}s`}
          duration={`${duration - (duration * delay)}s`}
          content={letter+content}
          char={letter}/>
      )
    })
  }, [text])

  if (!text || !color) return <></>

  return (
    <div className={styles.wrapper}>
      <div>
        {items}
      </div>
    </div>
  )
}