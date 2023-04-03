import React, { useMemo, useState } from 'react'
import * as styles from './winner.module.sass'
import Letter from './letter'
import { rand } from '../../../../league-core/src/helpers'

const maskLength = 9
const animationLength = 4
export default () => {
  const [active, setActive] = useState(true)
  const text = 'Scourge wins'
  const getRand = () => new Array(maskLength).fill(0).map(() => rand(maskLength)).join('')

  const items = useMemo(() => {
    if (!active) return []

    const array = text.split('')

    return array.map((letter, index) => {
      const content = getRand()
      const random = rand(maskLength)
      const steps = random - 1
      const offset = `${steps * -1}em`
      const delay = rand(100) / 100
      const duration = +Number(steps * (animationLength / random)).toFixed(2)

      return (
        <Letter
        animation={`letter${index}`}
        className={styles.letter}
        key={index}
        offset={offset}
        offsetTo={'0em'}
        delay={`${delay}s`}
        duration={`${duration - (duration * delay)}s`}
        content={letter+content}
        char={letter}/>
      )
    })
  }, [active])

  return (
    <div className={styles.wrapper}>
      <div className={styles.letters}>
        {items}
      </div>
      <button onClick={() => setActive(!active)}>Toggle</button>
    </div>
  )
}