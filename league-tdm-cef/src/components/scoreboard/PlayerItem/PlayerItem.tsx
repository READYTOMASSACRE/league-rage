import React, { FC, useEffect, useRef } from 'react'
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
      <div className={s.statistics}>
        {player.kills}
      </div>
      <div className={s.statistics}>
        {player.assists}
      </div>
      <div className={s.statistics}>
        {player.death}
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