import { Dummy, Entity } from "../../league-core/src/types/tdm";

export default class DummyService {
  getOne(type: Entity): DummyEntityMp | undefined {
    let dummy = undefined

    mp.dummies.forEachByType(type, (d) => {
      if (!dummy) {
        dummy = d
      }
    })

    return dummy
  }

  get<E extends Entity, K extends keyof Dummy[E]>(type: E, key: K, dummy?: DummyEntityMp): Dummy[E][K] | undefined {
    dummy = dummy ? dummy : this.getOne(type)

    if (!dummy) {
      return
    }

    return <Dummy[E][K]>dummy.getVariable(String(key))
  }
}