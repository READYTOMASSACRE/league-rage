export const isEntity = (o: any): o is EntityMp => {
  return Boolean(o?.id && o?.type && o?.remoteId && o?.handle)
}
export const isPlayer = (o: any): o is PlayerMp => {
  return isEntity(o) && o.type === 'player' && mp.players.exists(o as PlayerMp)
}