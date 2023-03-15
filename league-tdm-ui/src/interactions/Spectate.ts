import { event, eventable } from "../../../league-core/client"
import { Entity, State } from "../../../league-core/src/types/tdm"
import DummyService from "../DummyService"
import console from "../helpers/console"
import KeybindService, { key } from "../KeybindService"
import PlayerService from "../PlayerService"

@eventable
export default class Spectate {
  static readonly key = 'spectate'
  static readonly fov = 60

  private running: boolean = false
  private readonly setPlayerGamecam = '0x8BBACBF51DA047A8'
  private spectateCamera: CameraMp
  private gameplayCamera: CameraMp

  constructor(
    readonly dummyService: DummyService,
    readonly keybindService: KeybindService,
    readonly playerService: PlayerService
  ) {
    this.keybindService.unbind(key.a, true, this.turn('left'), Spectate.key)
    this.keybindService.unbind(key.d, true, this.turn('left'), Spectate.key)
    this.keybindService.bind(key.a, true, this.turn('left'), Spectate.key)
    this.keybindService.bind(key.d, true, this.turn('right'), Spectate.key)

    this.spectateCamera = mp.cameras.new(Spectate.key)
    this.gameplayCamera = mp.cameras.new('gameplay')
  }

  run() {
    if (this.running) {
      this.stop()
    }

    this.toggle(true)
    this.running = true
  }

  stop(err?: Error) {
    this.toggle(false)
    this.running = false
    if (err) {
      console.error(err.stack)
    }
  }

  private toggle(t: boolean) {
    this.playerService.setInvicible(t)
    this.playerService.setAlpha(t ? 0 : 255)
    mp.game.ui.displayRadar(!t)
    mp.game.ui.displayHud(!t)
    mp.game.cam.renderScriptCams(t, false, 0, true, false, 0)

    if (!t) {
      this.gameplayCamera.setActive(false)
      this.spectateCamera.setActive(false)
    }
  }

  @event('render')
  private render() {
    if (!this.running) {
      return
    }
  }

  @event('entityStreamIn')
  private entityStreamIn() {
    if (!this.running) {
      return
    }
  }

  private turn(side: 'right' | 'left') {
    return () => {
      if (this.running) {
        return
      }

    }
  }

  private get players() {
    try {
      const players = <number[]>JSON.parse(this.dummyService.get(Entity.ROUND, 'players'))

      return players
        .map((id) => mp.players.atRemoteId(id))
        .filter((player) => mp.players.exists(player) && this.playerService.getState(player) === State.alive)
    } catch (err) {
      this.stop(err)

      return []
    }
  }
}