import React, { useContext } from 'react'
import { ShrinkNavbar } from './context'

import * as styles from './styles/panel.module.sass'

const Header = () => {

  const { shrink, setShrink } = useContext(ShrinkNavbar)

  return (
    <div className={styles.header}>
      <div className={styles.btncont} onClick={() => setShrink && setShrink(!shrink)}>
        <img className={styles.icon} src={`/assets/svg/menu.svg`} alt="" />
      </div>
      <div className={styles.title}>some informnation</div>
      <div className={styles.btncont}>
        <img className={styles.icon} src={`/assets/svg/close.svg`} alt="" />
      </div>
    </div>
  )
}

export default Header
