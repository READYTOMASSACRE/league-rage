import React, { useContext } from 'react'
import { CurrentPage, ShrinkNavbar } from './context'
import Profile from 'jsx:../../../public/assets/svg/user-profile.svg'
import Matches from 'jsx:../../../public/assets/svg/list.svg'
import Vote from 'jsx:../../../public/assets/svg/vote.svg'
import About from 'jsx:../../../public/assets/svg/about.svg'

import * as styles from './styles/panel.module.sass'
import cl from 'classnames'
import RageAPI from '../../helpers/RageAPI'
import { Lang } from '../../../../league-lang/language'

const data = [
  { code: 'Profile', svg: <Profile className={styles.icon}/>,},
  { code: 'Matches', svg: <Matches className={styles.icon}/>,},
  { code: 'Vote', svg: <Vote className={styles.icon}/>,},
  { code: 'About', svg: <About className={styles.icon}/>},
]

const Navbar = () => {
  const titles = {
    Profile: RageAPI.lang.get(Lang['cef.panel.navbar_profile']),
    Matches: RageAPI.lang.get(Lang['cef.panel.navbar_matches']),
    Vote: RageAPI.lang.get(Lang['cef.panel.navbar_vote']),
    About: RageAPI.lang.get(Lang['cef.panel.navbar_about']),
  }

  const { currentPage, setCurrentPage } = useContext(CurrentPage)
  const { shrink } = useContext(ShrinkNavbar)

  return (
    <div className={cl(styles.navbar, !shrink && styles.shrink)}>
      {data.map((el) =>
        <div
          key={el.code}
          className={cl(styles.navbarItem, currentPage === el.code && styles.current)}
          onClick={() => setCurrentPage && setCurrentPage(el.code)}
        >
          {el.svg}
          <div className={styles.title}>{titles[el.code] ?? el.code}</div>
        </div>
      )}
    </div>
  )
}

export default Navbar
