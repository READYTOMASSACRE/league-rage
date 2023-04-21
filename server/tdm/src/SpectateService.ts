import { catchError, command, commandable, event, eventable, proc, proceable } from "../../league-core";
import { Events, Procs } from "../../league-core/src/types";
import { State, Team } from "../../league-core/src/types/tdm";
import { ILanguage, Lang } from "../../league-lang/language";
import BroadCastError from "./error/BroadCastError";
import ErrorNotifyHandler from "./error/ErrorNotifyHandler";
import PlayerService from "./PlayerService";
import RoundService from "./RoundService";
import TaskManager from "./TaskManager";

@proceable
@commandable
@eventable
export default class SpectateService {
  constructor(
    readonly playerService: PlayerService,
    readonly roundService: RoundService,
    readonly lang: ILanguage,
  ) {}

  @event(['playerDeath', 'playerQuit'])
  onPLayerDeathOrQuit(player: PlayerMp) {
    if (!this.roundService.running) {
      return
    }

    const players = this.playerService.getWithState(State.spectate)

    for (const spectatePlayer of players) {
      if (player.id === this.playerService.getSpectateId(spectatePlayer)) {
        this.stopSpectate(spectatePlayer)
      }
    }
  }

  @event(Events["tdm.round.end"])
  onRoundEnd() {
    return this.stopSpectatePlayers()
  }

  @event(Events["tdm.round.start"])
  async onRoundStart(arenaId: number, players: number[]) {
    this.stopSpectatePlayers()

    const spectators = this.playerService.getByTeam(Team.spectators)
    const [id] = players

    const player = mp.players.at(id)

    if (!mp.players.exists(player)) {
      return
    }

    for (const spectator of spectators) {
      try {
        this.validateSpectate(spectator, player)
      } catch (err) {
        continue
      }

      this.turnSpecate(spectator, 'start', player)
      TaskManager.add(() => {
        // todo fix spectate after start (re request while not streaming player)
        try {
          this.validateSpectate(spectator, player)
          this.turnSpecate(spectator, 'right')
        } catch (err) {
          console.error(err)
        }
      }, 0.5)
    }
  }

  @event(Events["tdm.round.remove"])
  onPlayerRemove(id: number, reason?: 'manual' | 'death') {
    if (!reason) {
      return
    }

    const player = mp.players.at(id)

    if (!mp.players.exists(player)) {
      return
    }

    const players = this.playerService.getWithState(State.spectate)

    for (const spectatePlayer of players) {
      if (player.id === this.playerService.getSpectateId(spectatePlayer)) {
        try {
          this.validateSpectate(spectatePlayer)
        } catch (err) {
          continue
        }

        this.turnSpecate(spectatePlayer, 'right')
      }
    }
  }

  @event(Events["tdm.round.add"])
  onPlayerAdd(id: number) {
    this.stopSpectate(id)
  }

  @catchError(ErrorNotifyHandler)
  @command(['spec', 'spectate'], { desc: Lang["cmd.spectate"] })
  spectate(player: PlayerMp, fullText: string, description: string, id?: string) {
    if (!id) {
      return player.outputChatBox(description)
    }

    const spectatePlayer = this.playerService.getByIdOrName(id)

    if (!spectatePlayer) {
      throw new BroadCastError(this.lang.get(Lang["error.player.not_found"], { player: id }), player)
    }

    if (Array.isArray(spectatePlayer)) {
      throw new BroadCastError(Lang["tdm.player.find_result"], player, { players: spectatePlayer.map(p => p.name).join(', ') })
    }

    if (this.playerService.hasState(player, State.spectate) && id === 'off') {
      return this.stopSpectate(player)
    }

    this.validateSpectate(player, spectatePlayer)
    this.turnSpecate(player, 'start', spectatePlayer)
  }

  @proc(Procs["tdm.spectate.move"])
  moveSpectate(player: PlayerMp, x: number, y: number, z: number, dimension: number) {
    try {
      if (!this.playerService.hasState(player, State.spectate)) {
        return
      }
  
      player.position = new mp.Vector3(x, y, z)
      player.dimension = dimension
  
      return true
    } catch (err) {
      console.error(err)
      return
    }
  }

  @proc(Procs["tdm.spectate.get"])
  getSpectateData(player: PlayerMp, id?: number) {
    if (!this.playerService.hasState(player, State.spectate)) {
      return
    }

    const targetPlayer = mp.players.at(id)

    if (!mp.players.exists(targetPlayer)) {
      return
    }

    return [...targetPlayer.position.toArray(), targetPlayer.dimension]
  }

  @event(Events["tdm.spectate.client_toggle"])
  clientToggle(player: PlayerMp, toggle: boolean) {
    if (toggle) {
      return
    }

    this.playerService.setVariable(player, 'spectate', undefined)
    this.playerService.spawnLobby(player)
  }

  validateSpectate(player: PlayerMp, spectatePlayer?: PlayerMp) {
    if (!this.roundService.running) {
      throw new BroadCastError(Lang["tdm.round.is_not_running"], player)
    }

    if (![State.dead, State.idle, State.spectate].includes(this.playerService.getState(player))) {
      throw new BroadCastError(Lang["error.spectate.not_same_team"], player)
    }

    if (!spectatePlayer) {
      return
    }

    if (
      this.playerService.getTeam(player) !== Team.spectators &&
      this.playerService.getTeam(player) !== this.playerService.getTeam(spectatePlayer)
    ) {
      throw new BroadCastError(Lang["error.spectate.not_same_team"], player)
    }

    if (!this.playerService.inRound(spectatePlayer)) {
      throw new BroadCastError(
        Lang["error.player.not_in_round"],
        player,
        { player: spectatePlayer.name }
      )
    }

    if (spectatePlayer.id === player.id) {
      throw new BroadCastError(Lang["error.spectate.same_player"], player)
    }
  }

  private stopSpectatePlayers() {
    const players = this.playerService.getWithState(State.spectate)

    for (const spectatePlayer of players) {
      this.stopSpectate(spectatePlayer)
    }
  }

  private stopSpectate(player: PlayerMp | number) {
    player = typeof player === 'number' ? mp.players.at(player) : player

    if (!mp.players.exists(player)) {
      return
    }

    this.playerService.call([player.id], Events["tdm.spectate.stop"])
  }

  private turnSpecate(
    player: PlayerMp | number,
    turn: 'start' | 'right' | 'left',
    spectatePlayer?: PlayerMp
  ) {
    player = typeof player === 'number' ? mp.players.at(player) : player

    if (!mp.players.exists(player)) {
      return
    }

    this.playerService.setState(player, State.spectate)

    if (spectatePlayer) {
      this.playerService.setVariable(player, 'spectate', spectatePlayer.id)
    }

    if (turn === 'start') {
      this.playerService.call([player.id], Events["tdm.spectate.start"], spectatePlayer?.id)
    } else {
      this.playerService.call([player.id], Events["tdm.spectate.turn"], turn)
    }
  }
}