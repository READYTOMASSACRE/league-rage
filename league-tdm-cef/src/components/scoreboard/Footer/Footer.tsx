import React, {FC} from 'react'
import { IPlayers } from '../../../types'
import * as s from './Footer.module.sass'

interface Props {
  spectators: IPlayers[];
}


const Footer: FC<Props> = ( {spectators} ) => {
  return (
    <div className={s.footer}>
      {spectators && spectators.map((spectator) => 
        <div key={spectator.id} className={s.spectator}>
          {spectator.name}
        </div>
      )}
    </div>
  )
}

export default Footer
