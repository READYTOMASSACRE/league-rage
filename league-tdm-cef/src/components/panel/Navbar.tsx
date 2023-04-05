import React, { useContext } from 'react'
import { CurrentPage, ShrinkNavbar } from './context'
import Profile from 'jsx:../../../public/assets/svg/user-profile.svg'
import Matches from 'jsx:../../../public/assets/svg/list.svg'
import Vote from 'jsx:../../../public/assets/svg/vote.svg'
import About from 'jsx:../../../public/assets/svg/about.svg'

import * as styles from './styles/panel.module.sass'
import cl from 'classnames'

const data = [
  { title: 'Profile', svg: <Profile className={styles.icon}/>,},
  { title: 'Matches', svg: <Matches className={styles.icon}/>,},
  { title: 'Vote', svg: <Vote className={styles.icon}/>,},
  { title: 'About', svg: <About className={styles.icon}/>},
]

const Navbar = () => {

  const { currentPage, setCurrentPage } = useContext(CurrentPage)
  const { shrink } = useContext(ShrinkNavbar)

  return (
    <div className={cl(styles.navbar, !shrink && styles.shrink)}>
      {data.map((el) =>
        <div key={el.title} className={cl(styles.navbarItem, currentPage === el.title && styles.current)} onClick={() => setCurrentPage && setCurrentPage(el.title)}>
          {el.svg}
          <div className={styles.title}>{el.title}</div>
        </div>
      )}
    </div>
  )
}

export default Navbar
