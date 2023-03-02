import React, { FC } from 'react'
import cl from 'classnames'
import s from './PlayerItem.module.sass'
import { IPlayers } from '../../../types'
import Cell from '../Cell/Cell';

interface Props {
  player: IPlayers;
  currentPlayer: boolean;
  position: number;
}

const PlayerItem: FC<Props> = ({ player, currentPlayer, position }) => {

  return (
    <div className={s.playerItem}>
      <Cell value={position} width={'22px'} display={'flex'} ai={'center'} jc={'center'}/>
      <Cell value={player.name} padding={'0 0 0 5px'}  ai={'center'} fg={1}/>
      <Cell value={player.kills} width={'33px'} display={'flex'} ai={'center'} jc={'center'}/>
      <Cell value={player.assists} width={'33px'} display={'flex'} ai={'center'} jc={'center'}/>
      <Cell value={player.death} width={'33px'} display={'flex'} ai={'center'} jc={'center'}/>
      <Cell value={player.ping} width={'33px'} display={'flex'} ai={'center'} jc={'center'}/>
        {/* <div className={s.position}>
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
        </div> */}
    </div>
  )
}

export default PlayerItem