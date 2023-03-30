import React, { FC } from 'react'

import * as styles from '../../styles/panel.module.sass'

interface Props {
  title: string
  value: string | number
}

const ProfileItem: FC<Props> = ({title, value}) => {
  return (
    <div className={styles.profileItem}>
      <span>{title}</span>
      <span>{value}</span>
    </div>
  )
}

export default ProfileItem
