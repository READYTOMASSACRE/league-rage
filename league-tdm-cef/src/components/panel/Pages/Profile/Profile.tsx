import React, { FC } from 'react'
import { ClientProfile } from '../../../../../../league-core/src/types/statistic'

import * as styles from '../../styles/panel.module.sass'
import ProfileItem from './ProfileItem'

interface Props {
  profile: ClientProfile
}



const Profile: FC<Props> = ({ profile }) => {
  return (
    <div className={styles.profile}>
      <div className={styles.profileTop}>
        <ProfileItem title={'Name'} value={profile.name} />
        <ProfileItem title={'Rating'} value={profile.rating} />
      </div>
      <div className={styles.profileCenter}>
        <ProfileItem title={'Matches'} value={profile.wins + profile.loses + profile.draws} />
        <ProfileItem title={'Victories'} value={profile.victory + '%'} />
        <ProfileItem title={'Average damage'} value={profile.averageDamage} />
        <ProfileItem title={'LVL'} value={profile.lvl} />
        <ProfileItem title={'XP'} value={profile.exp} />
        <ProfileItem title={'K/D/A'} value={profile.kda} />
        <ProfileItem title={'Kills'} value={profile.kill} />
        <ProfileItem title={'Death'} value={profile.death} />
        <ProfileItem title={'Assists'} value={profile.assists} />
        <ProfileItem title={'Hits'} value={profile.hit} />
        <ProfileItem title={'Damage done'} value={profile.damageDone} />
        <ProfileItem title={'Damage recieved'} value={profile.damageRecieved} />
      </div>
    </div>
  )
}

export default Profile
