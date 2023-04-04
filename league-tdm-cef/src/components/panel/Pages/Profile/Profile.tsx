import React, { FC } from 'react'
import { ClientProfile } from '../../../../../../league-core/src/types/statistic'

import * as styles from '../../styles/panel.module.sass'
import ProfileItem from './ProfileItem'

interface Props {
  profile: ClientProfile
  matches: number
}



const Profile: FC<Props> = ({ profile, matches }) => {
  return (
    <div className={styles.profile}>
      <div className={styles.profileTop}>
        <ProfileItem title={'Name'} value={profile.name} />
        <ProfileItem title={'Rating'} value={(((profile.kill + profile.assists) / profile.death) * profile.lvl).toFixed()} />
      </div>
      <div className={styles.profileCenter}>
        <ProfileItem title={'Matches'} value={matches} />
        <ProfileItem title={'Victories'} value={'60.78%'} />
        <ProfileItem title={'LVL'} value={profile.lvl} />
        <ProfileItem title={'Avarege XP'} value={(profile.exp / matches || 0).toFixed()} />
        <ProfileItem title={'K/D/A'} value={((profile.kill + profile.assists) / profile.death || profile.kill + profile.assists).toFixed(1)} />
        <ProfileItem title={'Kills'} value={profile.kill} />
        <ProfileItem title={'Death'} value={profile.death} />
        <ProfileItem title={'Assists'} value={profile.assists} />
        <ProfileItem title={'Avarage damage'} value={(profile.damageDone / matches || 0).toFixed(1)} />
        <ProfileItem title={'Hits'} value={profile.hit} />
        <ProfileItem title={'Damage done'} value={profile.damageDone} />
        <ProfileItem title={'Damage recived'} value={profile.damageRecieved} />
      </div>
    </div>
  )
}

export default Profile
