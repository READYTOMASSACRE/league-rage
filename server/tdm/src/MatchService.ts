import { event } from "../../../core";
import { toMs } from "../../../core/src/helpers";
import { Events } from "../../../core/src/types";
import { MatchConfig } from "../../../core/src/types/tdm";
import RoundService from "./RoundService";
import VoteService from "./VoteService";

export default class MatchService {
  #lastRound: boolean = false

  private mapId: string = ""
  private date: number = 0
  private timeleftTimer: ReturnType<typeof setTimeout>

  constructor(
    readonly config: MatchConfig,
    readonly roundService: RoundService,
    readonly voteService: VoteService,
  ) {
    this.onTimeleft()
  }

  onTimeleft() {
    clearTimeout(this.timeleftTimer)

    this.changeMap()
    this.timeleftTimer = setTimeout(() => this.onTimeleft(), toMs(this.config.timeleft))
    this.date = Date.now()

    mp.events.call(Events["tdm.match.timeleft"])
  }

  changeMap(mapId?: string, force?: boolean) {
    if (force) {
      this.roundService.stop()
    }

    this.mapId = mapId ?? this.getNominatedMap()
    this.lastRound = true

    if (!this.roundService.running) {
      this.startNewRound()
    }
  }

  getNominatedMap() {
    return this.mapId
  }

  @event(Events["tdm.round.end"])
  startNewRound() {
    if (this.lastRound) {
      mp.events.call(Events["tdm.match.change_map"], this.mapId)
      this.lastRound = false
    }

    setTimeout(() => this.roundService.start(this.mapId), toMs(this.config.prepare))
  }

  public get lastRound() {
    return this.#lastRound
  }

  private set lastRound(last: boolean) {
    this.#lastRound = last
  }

  get timeleft() {
    const ms = toMs(this.config.timeleft) - (Date.now() - this.date)

    return ms > 0 ? ms : 0
  }
}