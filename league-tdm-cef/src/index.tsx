import React from 'react'
import { render } from 'react-dom'
import {Scoreboard} from './components/scoreboard'

const App = () => {
  return (
    <>
      <Scoreboard />
    </>
  )
}

render(<App />, document.getElementById('root'))