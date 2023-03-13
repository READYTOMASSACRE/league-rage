import { event, eventable, log } from "../../league-core"
import { Events } from "../../league-core/src/types"
import { Dummy, Entity } from "../../league-core/src/types/tdm"

@eventable
export default class DummyService {
  public round: DummyMp

  constructor() {
    this.setDefault(Entity.ROUND, { started: false })
  }

  @log
  @event(Events["tdm.round.prepare"])
  roundPrepare() {
    this.set(Entity.ROUND, 'started', true)
  }

  @event(Events["tdm.round.end"])
  roundEnd() {
    this.set(Entity.ROUND, 'started', false)
  }

  getOne(type: Entity): DummyMp | undefined {
    let dummy = undefined

    mp.dummies.forEachByType(type, d => {
      if (!dummy) {
        dummy = d
      }
    })

    return dummy
  }

  get<E extends Entity, K extends keyof Dummy[E]>(type: E, key: K, dummy?: DummyMp): Dummy[E][K] | undefined {
    dummy = dummy ? dummy : this.getOne(type)

    if (!dummy) {
      return
    }

    return <Dummy[E][K]>dummy.getVariable(String(key))
  }

  set< E extends Entity, K extends keyof Dummy[E], V extends Dummy[E][K]>(
    type: E, key: K, value: V, dummy?: DummyMp
  ) {
    dummy = dummy ? dummy : this.getOne(type)
    dummy.setVariable(String(key), value)
  }

  setDefault<E extends Entity>(type: E, data: Dummy[E]) {
    return mp.dummies.new(type, data)
  }
}