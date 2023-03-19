import { command, commandable, event, eventable, log, proc, proceable } from "../../league-core";
import { Events, Procs } from "../../league-core/src/types";
import { State, Team } from "../../league-core/src/types/tdm";
import { ILanguage, Lang } from "../../league-lang/language";
import BroadCastError from "./error/BroadCastError";
import PlayerService from "./PlayerService";
import RoundService from "./RoundService";

@proceable
@commandable
@eventable
export default class SpectateService {
  constructor(
    readonly playerService: PlayerService,
    readonly roundService: RoundService,
    readonly lang: ILanguage,
  ) {}

  @log
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

  @log
  @event([Events["tdm.round.end"], Events["tdm.round.start"]])
  onRoundStartOrEnd() {
    const players = this.playerService.getWithState(State.spectate)

    for (const spectatePlayer of players) {
      this.stopSpectate(spectatePlayer)
    }
  }

  @log
  @event(Events["tdm.round.remove"])
  onPlayerRemove(id: number) {
    const player = mp.players.at(id)

    if (!mp.players.exists(player)) {
      return
    }

    const players = this.playerService.getWithState(State.spectate)

    for (const spectatePlayer of players) {
      if (player.id === this.playerService.getSpectateId(spectatePlayer)) {
        this.stopSpectate(spectatePlayer)
      }
    }
  }

  @log
  @event(Events["tdm.round.add"])
  onPlayerAdd(id: number) {
    this.stopSpectate(id)
  }

  @log
  @command(['spec', 'spectate'], { desc: Lang["cmd.spectate"] })
  spectate(player: PlayerMp, fullText: string, description: string, id?: string) {
    if (!this.roundService.running) {
      throw new BroadCastError(this.lang.get(Lang["tdm.round.is_not_running"]), player)
    }

    if (![State.dead, State.idle, State.spectate].includes(this.playerService.getState(player))) {
      throw new BroadCastError(this.lang.get(Lang["error.spectate.not_same_team"]), player)
    }

    if (!id) {
      return player.outputChatBox(description)
    }

    if (this.playerService.hasState(player, State.spectate) && id === 'off') {
      return this.stopSpectate(player)
    }

    const spectatePlayer = this.playerService.getByIdOrName(id)

    if (!spectatePlayer) {
      throw new BroadCastError(this.lang.get(Lang["error.player.not_found"], { player: id }), player)
    }

    if (Array.isArray(spectatePlayer)) {
      const message = this.lang.get(Lang["tdm.player.find_result"], { players: spectatePlayer.map(p => p.name).join(', ') })
      throw new BroadCastError(message, player)
    }

    if (
      this.playerService.getTeam(player) !== Team.spectators &&
      this.playerService.getTeam(player) !== this.playerService.getTeam(spectatePlayer)
    ) {
      throw new BroadCastError(this.lang.get(Lang["error.spectate.not_same_team"]), player)
    }

    if (!this.playerService.hasState(spectatePlayer, State.alive)) {
      throw new BroadCastError(
        this.lang.get(Lang["error.player.not_in_round"], { player: spectatePlayer.name }),
        player
      )
    }

    if (spectatePlayer.id === player.id) {
      throw new BroadCastError(this.lang.get(Lang["error.spectate.same_player"]), player)
    }

    this.playerService.setState(player, State.spectate)
    this.playerService.setVariable(player, 'spectate', spectatePlayer.id)
    this.playerService.call([player.id], Events["tdm.spectate.start"], spectatePlayer.id)
  }

  @log
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

  @log
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

  private stopSpectate(player: PlayerMp | number) {
    player = typeof player === 'number' ? mp.players.at(player) : player

    if (!mp.players.exists(player)) {
      return
    }

    this.playerService.call([player.id], Events["tdm.spectate.stop"])
    this.playerService.setVariable(player, 'spectate', undefined)

    const state = this.playerService.getState(player)

    if (state === State.spectate) {
      this.playerService.setState(player, State.idle)
    }

    if (state !== State.alive) {
      this.playerService.spawnLobby(player)
    }
  }
}