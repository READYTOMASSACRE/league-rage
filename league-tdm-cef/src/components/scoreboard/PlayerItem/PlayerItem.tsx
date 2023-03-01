import React, { FC } from 'react'
import cl from 'classnames'
import s from './PlayerItem.module.sass'
import { IPlayers } from '../../../types'

interface Props {
  player: IPlayers;
  currentPlayer: boolean;
  position: number;
}

const PlayerItem: FC<Props> = ({ player, currentPlayer, position }) => {

  return (
    <div className={s.playerItem}>
        <div className={s.position}>
          {position}
        </div>
        <div className={cl(s.name, currentPlayer && s.current)}>
          {player.name}
        </div>
        <div className={s.kills}>
          {player.kills}
        </div>
        <div className={s.assists}>
          {player.assists}
        </div>
        <div className={s.death}>
          {player.death}
        </div>
        <div className={s.ping}>
          {player.ping}
        </div>
    </div>
  )
}

export default PlayerItem
