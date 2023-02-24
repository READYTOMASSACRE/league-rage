import { existsSync, readFileSync, writeFileSync } from "fs"
import NotFoundError from "../error/NotFoundError"
import { rand } from "../helpers"
import { log } from "../helpers/decorators/log"
import { ArenaConfig, Team } from "../types"

export default class Arena {
  readonly arena: ArenaConfig
  readonly id: number

  private static _arenas?: ArenaConfig[]
  private static indexById: Record<number, number> = {}
  private static indexByCode: Record<string, number> = {}

  constructor(id: number | string, player?: PlayerMp) {
    const index = typeof Arena.indexById[id] !== 'undefined'
      ? Arena.indexById[id]
      : Arena.indexByCode[id]

    if (!Arena.arenas[index]) {
      throw new NotFoundError(`Arena ${id} not found`, player)
    }

    this.arena = Arena.arenas[index]
    this.id = this.arena.id
  }

  @log
  getRandVector(team: Team): Vector3Mp {
    const randIndex = rand(this.arena[team].length)

    return new mp.Vector3(...this.arena[team][randIndex])
  }

  static get arenas() {
    return this._arenas
  }

  @log
  static load(path: string) {
    if (this._arenas) return

    if (!existsSync(path)) writeFileSync(path, '[]')

    const arenas = JSON.parse(readFileSync(path).toString()) as ArenaConfig[]

    if (arenas.filter(this.isArenaConfig).length !== arenas.length) {
      throw new Error('Invalid arenas format')
    }

    this._arenas = arenas

    const {indexById, indexByCode} = arenas.reduce((acc, current, index) => {
      acc.indexById[current.id] = index
      acc.indexByCode[current.code] = index

      return acc
    }, {
      indexById: {},
      indexByCode: {}
    })

    this.indexById = indexById
    this.indexByCode = indexByCode
  }

  @log
  private static isArenaConfig(a: any): a is ArenaConfig {
    return Boolean(a?.id && a?.area)
  }
}