import React from 'react'
import * as s from './index.module.sass'
import cl from 'classnames'

const Scoreboard = () => {
  return <h1 className={cl(s.helloworld, s.active)}>Hello world</h1>
}

export {Scoreboard}