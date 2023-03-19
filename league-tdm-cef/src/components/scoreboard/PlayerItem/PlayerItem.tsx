import React, { FC } from 'react'
import cl from 'classnames'
import * as s from './PlayerItem.module.sass'
import { scoreboard } from '../../../../../league-core/src/types';


interface Props {
  player: scoreboard.Player;
  currentPlayer: boolean;
  position: number;
}

const PlayerItem: FC<Props> = ({ player, currentPlayer, position }) => {

  return (
    <div className={cl(s.playerItem, currentPlayer && s.currentPlayerItem)}>
      <div className={s.position}>
        {player.id}
      </div>
      <div className={cl(s.name, currentPlayer && s.current)}>
        {player.name}
      </div>
      <div className={s.statistics}>
        {player.kills}
      </div>
      <div className={s.statistics}>
        {player.death}
      </div>
      <div className={s.statistics}>
        {player.assists}
      </div>
      <div className={s.statistics}>
        {player.lvl}
      </div>
      <div className={s.statistics}>
        {player.ping}
      </div>
    </div>
  )
}

export default PlayerItem