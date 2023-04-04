import React, { useContext } from 'react'
import { CurrentPage, ShrinkNavbar } from './context'

import * as styles from './styles/panel.module.sass'
import cl from 'classnames'

const data = [
  { title: 'Profile', svg: 'user-profile' },
  { title: 'Matches', svg: 'list' },
  { title: 'Vote', svg: 'vote' },
  { title: 'About', svg: 'about' },
]

const Navbar = () => {

  const { currentPage, setCurrentPage } = useContext(CurrentPage)
  const { shrink } = useContext(ShrinkNavbar)

  return (
    <div className={cl(styles.navbar, !shrink && styles.shrink)}>
      {data.map((el) =>
        <div key={el.title} className={cl(styles.navbarItem, currentPage === el.title && styles.current)} onClick={() => setCurrentPage && setCurrentPage(el.title)}>
          <img src={`/assets/svg/${el.svg}.svg`} className={styles.icon} alt="" />
          <div className={styles.title}>{el.title}</div>
        </div>
      )}
    </div>
  )
}

export default Navbar
