import { Dummy, Entity, RoundState, Team } from "../types/tdm"

export interface IDummyService {
  getOne(type: Entity): DummyMp | undefined
  get<E extends Entity, K extends keyof Dummy[E]>(type: E, key: K, dummy?: DummyMp): Dummy[E][K] | undefined
  set<E extends Entity, K extends keyof Dummy[E], V extends Dummy[E][K]>(
    type: E, key: K, value: V, dummy?: DummyMp
  ): void
}

export default new class DummyService implements IDummyService {
  readonly dummies: {
    [Entity.ROUND]: DummyMp
    [Entity.TEAM]: DummyMp
  }

  constructor() {
    this.dummies = {
      [Entity.ROUND]: this.setDefault(Entity.ROUND, {
        arena: '',
        state: RoundState.stopped,
        time: 0,
        players: '[]',
      }),
      [Entity.TEAM]: this.setDefault(Entity.TEAM, {
        [Team.attackers]: { score: 0 },
        [Team.defenders]: { score: 0 },
        [Team.spectators]: { score: 0 },
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

    return <Dummy[E][K]>(dummy as any).getVariable(String(key))
  }

  set<E extends Entity, K extends keyof Dummy[E], V extends Dummy[E][K]>(
    type: E, key: K, value: V, dummy?: DummyMp
  ) {
    dummy = dummy ? dummy : this.getOne(type);
    (dummy as any).setVariable(String(key), value)
  }

  setDefault<E extends Entity>(type: E, data: Dummy[E]) {
    return (mp as any).dummies.new(type, data)
  }
}