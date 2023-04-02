import React, { useEffect, useState } from 'react'
import { Active, CurrentPage, ShrinkNavbar } from './context'

import * as styles from './styles/panel.module.sass'

import Header from './Header'
import Main from './Main'
import Navbar from './Navbar'

export default () => {

  const [active, setActive] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<string>('Vote')
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