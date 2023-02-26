export default class BroadCastError extends Error {
  constructor(message: string, player?: PlayerMp | number) {
    super(message)

    if (player && mp.players.exists(player)) {
      const p = typeof player === 'number' ? mp.players.at(player) : player
      p.outputChatBox(message)
    }
  }
}