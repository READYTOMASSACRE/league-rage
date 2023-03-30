import React, { useEffect, useState } from 'react'
import { Active, CurrentPage, ShrinkNavbar } from './context'

import * as styles from './styles/panel.module.sass'

import { Events } from '../../../../league-core/src/types'
import { ClientProfile, Round } from '../../../../league-core/src/types/statistic'
import cefLog from '../../helpers/cefLog'
import RageAPI from '../../helpers/RageAPI'

import Header from './Header'
import Main from './Main'
import Navbar from './Navbar'

export default () => {

  const [active, setActive] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<string>('Games')
  const [shrink, setShrink] = useState<boolean>(false)

  if (!active) return <></>

  return (
    <div className={styles.root}>
      <CurrentPage.Provider value={{ currentPage, setCurrentPage }}>
      <ShrinkNavbar.Provider value={{ shrink, setShrink }}>
      <Active.Provider value={{active, setActive}}>
        <Header />
        <Navbar />
        <Main />
      </Active.Provider>
      </ShrinkNavbar.Provider>
      </CurrentPage.Provider>
    </div>
  )
}

// export default () => {
//   const [active, setActive] = useState(false)
//   const [profile, setProfile] = useState<ClientProfile>()
//   const [rounds, setRounds] = useState<Round[]>([])

//   useEffect(() => {
//     RageAPI.subscribe(Events['tdm.cef.panel'], 'panel', (data: string | boolean) => {
//       try {
//         if (typeof data === 'boolean') {
//           setActive(data)
//           return
//         }

//         const {
//           profile,
//           rounds = [],
//           visible,
//         } = JSON.parse(data)

//         cefLog(data)
//         setProfile(profile)
//         setRounds(rounds)
//         setActive(visible)
//       } catch (err) {
//         cefLog(err)
//       }

//       return () => {
//         RageAPI.unsubscribe(Events['tdm.cef.panel'], 'panel')
//       }
//     })
//   }, [])

//   if (!active) return <></>

//   const userId = undefined
//   const dateFrom = undefined
//   const dateTo = undefined

//   return (
//     <div onClick={() => console.log(123)} className={styles.root}>
//       {Object.entries(profile || {}).map(([key, value]: [string, any], index) => (
//         <span key={index}>{key}: {value}</span>
//       ))}
//       <span>Rounds:</span>
//       {rounds.map((round, index) => (
//         <span key={index}>Date: {(new Date(round.id).toDateString())}, Result: {round.result}</span>
//       ))}
//       <button onClick={() => RageAPI.panelRequest(userId, dateFrom, dateTo)}>Fetch data</button>
//       <button onClick={() => RageAPI.panelClose()}>Close</button>
//     </div>
//   )
// }