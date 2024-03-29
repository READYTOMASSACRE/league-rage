export const ensurePlayer = function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
  const child = descriptor.value
  descriptor.value = function (..._args: any[]) {
    let [player, ...args] = _args

    if (typeof player === 'number') {
      player = mp.players.at(player)
    }

    if (!mp.players.exists(player)) {
      try {
        throw new Error(`Player ${player?.id} not found`)
      } catch (err) {
        console.error(err)
        return
      }
    }

    return child.apply(this, [player, ...args])
  }

  return descriptor
}