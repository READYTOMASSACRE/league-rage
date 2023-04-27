export default class BroadCastError extends Error {
  public player?: PlayerMp | number
  public bindings: Record<string, any>

  constructor(message: string, player: PlayerMp | number, bindings: Record<string, any> = {}) {
    super(message)
    this.player = player
    this.bindings = bindings
  }
}