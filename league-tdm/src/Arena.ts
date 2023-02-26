import { existsSync, readFileSync, writeFileSync } from "fs"
import NotFoundError from "./error/NotFoundError"
import { arenaPath } from "./helpers"
import { log, helpers } from '../../core/server'
import { ArenaConfig, Team } from "./types"

export default class Arena {
  readonly arena: ArenaConfig
  readonly id: number

  private static _arenas: ArenaConfig[] = []
  private static indexById: Record<number, number> = {}
  private static indexByCode: Record<string, number> = {}

  constructor(id: number | string, player?: PlayerMp) {
    const arena = Arena.get(id, player)

    this.arena = arena
    this.id = this.arena.id
  }

  @log
  getRandVector(team: Team): Vector3Mp {
    const randIndex = helpers.rand(this.arena[team].length)
    const vector = this.arena[team][randIndex]

    if (!vector) {
      throw new NotFoundError(`Not found spawn points in arena ${this.arena.id}`)
    }

    return new mp.Vector3(...vector)
  }

  static get arenas() {
    return this._arenas
  }

  static get(id: number | string, player?: PlayerMp): ArenaConfig | undefined {
    const index = typeof Arena.indexById[id] !== 'undefined'
      ? Arena.indexById[id]
      : Arena.indexByCode[id]


    if (!this.arenas[index]) {
      throw new NotFoundError(`Arena ${id} not found`, player)
    }

    return this.arenas[index]
  }

  @log
  static load() {
    const path = arenaPath
    if (!existsSync(path)) writeFileSync(path, '[]')

    const arenas = JSON.parse(readFileSync(path).toString()) as ArenaConfig[]

    if (arenas.filter(this.isArenaConfig).length !== arenas.length) {
      throw new Error('Invalid arenas format')
    }

    this._arenas = arenas.map(arena => {
      return {
        [Team.attackers]: [],
        [Team.defenders]: [],
        [Team.spectators]: [],
        ...arena,
      }
    })

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

    return true
  }

  private static isArenaConfig(a: any): a is ArenaConfig {
    return typeof a?.id !== 'undefined' &&
      Array.isArray(a?.area) &&
      Array.isArray(a?.[Team.attackers]) &&
      Array.isArray(a?.[Team.defenders])
  }
}