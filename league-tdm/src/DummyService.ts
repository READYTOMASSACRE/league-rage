import { eventable } from "../../league-core"
import { Dummy, Entity, RoundState } from "../../league-core/src/types/tdm"

@eventable
export default class DummyService {
  private dummies: {
    [Entity.ROUND]: DummyMp
  }

  constructor() {
    this.dummies = {
      [Entity.ROUND]: this.setDefault(Entity.ROUND, {
        arena: '',
        state: RoundState.stopped,
        time: 0,
        players: '[]',
      }),
    }
  }

  getOne(type: Entity): DummyMp | undefined {
    return this.dummies[type]
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