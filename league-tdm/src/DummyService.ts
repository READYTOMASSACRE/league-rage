import { event, eventable } from "../../league-core"
import { Events } from "../../league-core/src/types"
import { Entity } from "../../league-core/src/types/tdm"

@eventable
export default class DummyService {
  public round: DummyMp

  constructor() {
    this.round = mp.dummies.new(Entity.ROUND, { started: false })
  }

  @event(Events["tdm.round.prepare"])
  roundPrepare() {
    this.round.setVariable('started', true)
  }

  @event(Events["tdm.round.end"])
  roundEnd() {
    this.round.setVariable('started', false)
  }
}