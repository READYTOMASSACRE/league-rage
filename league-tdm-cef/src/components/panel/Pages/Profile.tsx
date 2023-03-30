import React, { FC } from 'react'
import { ClientProfile } from '../../../../../league-core/src/types/statistic'

import * as styles from '../styles/panel.module.sass'

interface Props {
  profile: ClientProfile
  matches: number
}

const Profile: FC <Props> = ({profile, matches}) => {
  return (
    <div className={styles.profile}>
        <div className={styles.profileTop}>
          <div>
            <span>Name</span>
            <span>{profile.name}</span>
          </div>
          <div>
            <span>Rating</span>
            <span>{(((profile.kill + profile.assists) / profile.death) * profile.lvl).toFixed()}</span>
          </div>
        </div>
        <div className={styles.profileCenter}>
          <div>
            <span>Matches</span>
            <span>{matches}</span>
          </div>
          <div>
            <span>Victories</span>
            <span>60.78%</span>
          </div>
          <div>
            <span>LVL</span>
            <span>{profile.lvl}</span>
          </div>
          <div>
            <span>Avarege XP</span>
            <span>{matches === 0 ? 0 : (profile.exp / matches).toFixed()}</span>
          </div>
          <div>
            <span>K/D/A</span>
            <span>{((profile.kill + profile.assists) / profile.death).toFixed(1)}</span>
          </div>
          <div>
            <span>Kill</span>
            <span>{profile.kill}</span>
          </div>
          <div>
            <span>Death</span>
            <span>{profile.death}</span>
          </div>
          <div>
            <span>Assists</span>
            <span>{profile.assists}</span>
          </div>
          <div>
            <span>Avarage damage</span>
            <span>{matches === 0 ? 0 : (profile.damageDone / matches).toFixed(1)}</span>
          </div>
          <div>
            <span>Hits</span>
            <span>{profile.hit}</span>
          </div>
          <div>
            <span>Damage done</span>
            <span>{profile.damageDone}</span>
          </div>
          <div>
            <span>Damage recived</span>
            <span>{profile.damageRecieved}</span>
          </div>
        </div>
      </div>
  )
}

export default Profile
