export default class Arena {
  readonly dimension = 0
  constructor(readonly id: number) {}

  getRandVector(teamId: number): Vector3Mp {
    return new mp.Vector3(0, 0, 0)
  }
}