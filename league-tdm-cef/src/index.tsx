import React from 'react'
import { render } from 'react-dom'
import { Chat } from './components/chat'
import { Scoreboard } from './components/scoreboard'
import './index.module.sass'

const App = () => {
  return (
    <>
      <Scoreboard />
      <Chat />
    </>
  )
}

render(<App />, document.getElementById('root'))