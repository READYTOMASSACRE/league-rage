import React, { useContext } from 'react'
import { ShrinkNavbar } from './context'
import Menu from 'jsx:../../../public/assets/svg/menu.svg'
import Close from 'jsx:../../../public/assets/svg/close.svg'

import * as styles from './styles/panel.module.sass'
import RageAPI from '../../helpers/RageAPI'

const Header = ({ title }: { title: string }) => {

  const { shrink, setShrink } = useContext(ShrinkNavbar)

  return (
    <div className={styles.header}>
      <div className={styles.btncont} onClick={() => setShrink && setShrink(!shrink)}>
        <Menu className={styles.icon}/>
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.btncont}>
        <Close className={styles.icon} onClick={() => RageAPI.panelClose()}/>
      </div>
    </div>
  )
}

export default Header
