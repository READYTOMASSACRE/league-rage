export default class PermissionError extends Error {
  constructor(permission: string, player?: PlayerMp | number) {
    super(permission)

    if (player && mp.players.exists(player)) {
      const p = typeof player === 'number' ? mp.players.at(player) : player
      p.outputChatBox(`Invalid permission ${permission}`)
    }
  }
}