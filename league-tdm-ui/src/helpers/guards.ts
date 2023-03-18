export const isEntity = (o: any): o is EntityMp => {
  return typeof o?.id !== 'undefined' &&
    typeof o?.remoteId !== 'undefined' &&
    typeof o?.handle !== 'undefined' &&
    Boolean(o?.type)
}
export const isPlayer = (o: any): o is PlayerMp => {
  return o?.type === 'player' && mp.players.exists(o as PlayerMp)
}