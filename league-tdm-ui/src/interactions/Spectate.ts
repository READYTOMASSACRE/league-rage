import { event, eventable } from "../../../league-core/client"
import { Events, Procs } from "../../../league-core/src/types"
import { Entity, State } from "../../../league-core/src/types/tdm"
import DummyService from "../DummyService"
import console from "../helpers/console"
import { isPlayer } from "../helpers/guards"
import KeybindService, { key } from "../KeybindService"
import PlayerService from "../PlayerService"

@eventable
export default class Spectate {
  static readonly key = 'spectate'
  static readonly fov = 60

  private running: boolean = false
  private readonly setPlayerGamecam = '0x8BBACBF51DA047A8'
  private gameplayCamera: CameraMp
  private streamingPlayer: PlayerMp = mp.players.local
  private streamingVector: Vector3 = mp.players.local.position
  private prepared: boolean = false
  private current: number = 0

  constructor(
    readonly dummyService: DummyService,
    readonly keybindService: KeybindService,
    readonly playerService: PlayerService
  ) {
    this.keybindService.unbind(key.a, true, Spectate.key)
    this.keybindService.unbind(key.d, true, Spectate.key)
    this.keybindService.bind(key.a, true, this.turn('left'), Spectate.key)
    this.keybindService.bind(key.d, true, this.turn('right'), Spectate.key)
    this.gameplayCamera = mp.cameras.new('gameplay')
  }

  run(remoteId?: number) {
    try {
      if (this.running) {
        return
      }

      const player = mp.players.atRemoteId(remoteId)

      if (!mp.players.exists(player)) {
        return
      }

      this.streamingPlayer = player
      this.toggle(true)
      this.running = true
    } catch (err) {
      this.stop(err)
    }
  }

  stop(err?: Error) {
    try {
      this.toggle(false)
      if (err) console.error(err.stack)
    } catch (err) {
      console.error(err.stack)
    } finally {
      this.running = false
      this.prepared = false
      mp.events.callRemote(Events["tdm.spectate.stop"])
    }
  }

  private toggle(t: boolean) {
    this.playerService.setInvicible(t)
    this.playerService.setAlpha(t ? 0 : 255)
    mp.game.ui.displayRadar(!t)
    mp.game.ui.displayHud(!t)

    if (!t) {
      this.gameplayCamera.setActive(false)
      mp.players.forEach(player => {
        this.playerService.setInvicible(false, player)
        this.playerService.setAlpha(255, player)
      })
    } else {
      this.prepare()
    }
  }

  @event('render')
  render() {
    try {
      if (!this.running) {
        return
      }

      if (!this.prepared) {
        return this.playerService.setCoordsNoOffset(
          this.streamingVector.x,
          this.streamingVector.y,
          this.streamingVector.z - 5
        )
      }

      if (!this.streamingPlayerInStream) {
        return this.streamingPlayer.forceStreamingUpdate()
      }

      const vector = this.isNotEmptyVector(this.streamingPlayer.position) ?
        this.streamingPlayer.position :
        this.streamingVector

      this.playerService.setCoordsNoOffset(
        vector.x,
        vector.y,
        vector.z - 5
      )

      this.setGamecam()
    } catch (err) {
      this.stop(err)
    }
  }

  @event('entityStreamIn')
  entityStreamIn(entity: EntityMp) {
    try {
      if (isPlayer(entity)) {
        const spectate = this.playerService.getState(entity) === State.spectate
  
        this.playerService.setInvicible(spectate, entity)
        this.playerService.setAlpha(spectate ? 0 : 255, entity)
  
        if (!this.running) {
          return
        }
  
        if (entity.handle === this.streamingPlayer.handle) {
          this.prepare()
        }
      }
    } catch (err) {
      this.stop(err)
    }
  }

  private isNotEmptyVector(vector: Vector3): boolean {
    const { x, y } = vector

    return x >= 1 || y >= 1 || x <= -1 || y <= -1
  }

  private async prepare(force?: boolean) {
    if (this.prepared) {
      return
    }

    if (!this.streamingPlayerInStream) { // (!this.streamingPlayerInStream || force)
      const [x, y, z, dimension] = await this.playerService.getPositionProc(this.streamingPlayer)
      const vector = new mp.Vector3(x, y, z)

      if (!vector || typeof dimension === 'undefined') {
        return this.stop()
      }

      this.gameplayCamera.setActive(false)
      const moved = await mp.events.callRemoteProc(Procs["tdm.spectate.move"], vector.x, vector.y, vector.z, dimension)

      if (!moved) {
        return this.stop()
      }

      this.streamingPlayer.forceStreamingUpdate()
      this.streamingVector = vector
      
      // if (force) this.prepare()
      return
    }

    this.gameplayCamera.setActive(true)
    this.prepared = true
  }

  private turn(direction: 'right' | 'left') {
    return () => {
      try {
        if (!this.running) {
          return
        }

        const players = this.players

        if (!players.length) {
          return this.stop()
        }

        const side = {
          right: [this.current + 1, 0],
          left: [this.current - 1, players.length - 1]
        }
        
        const [next, last] = side[direction]
        const nextCurrent = typeof players[next] !== 'undefined' ? next : last

        this.current = nextCurrent
        this.streamingPlayer = players[this.current]
        this.prepared = false
        this.prepare(true)
      } catch (err) {
        this.stop(err)
      }
    }
  }

  private setGamecam() {
    mp.game.invoke(this.setPlayerGamecam, this.streamingPlayer.handle)
  }

  private get streamingPlayerInStream() {
    return this.streamingPlayer.handle !== 0
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