import { existsSync, readFileSync, writeFileSync } from "fs"
import NotFoundError from "./error/NotFoundError"
import { arenaPath } from "./helpers"
import { helpers, types, command, commandable } from '../../league-core'
import { ILanguage, Lang } from "../../league-lang/language"

@commandable
export default class Arena {
  readonly arena: types.tdm.Arena
  readonly id: number
  readonly code: string

  private static _arenas: types.tdm.Arena[] = []
  private static indexById: Record<number, number> = {}
  private static indexByCode: Record<string, number> = {}

  private readonly lang: ILanguage

  constructor(id: number | string, lang: ILanguage, player?: PlayerMp) {
    const arena = Arena.get(id, player)

    this.arena = arena
    this.id = this.arena.id
    this.code = this.arena.code
    this.lang = lang
  }

  getRandVector(team: types.tdm.Team): Vector3 {
    const randIndex = helpers.rand(this.arena[team].length)
    const vector = this.arena[team][randIndex]

    if (!vector) {
      throw new NotFoundError(this.lang.get(Lang["error.arena.not_found_spawn"], { arena: this.arena.id }))
    }

    return new mp.Vector3(...vector)
  }

  static get arenas() {
    return this._arenas
  }

  static get(id: number | string, player?: PlayerMp, lang?: ILanguage): types.tdm.Arena {
    const index = typeof Arena.indexById[id] !== 'undefined'
      ? Arena.indexById[id]
      : Arena.indexByCode[id]


    if (!this.arenas[index]) {
      throw new NotFoundError(
        lang ?
          lang.get(Lang["error.arena.not_found"], { arena: id }) :
          `Arena ${id} not found`,
        player
      )
    }

    return this.arenas[index]
  }

  @command('la') // todo delete me or add check admin rights
  static load(lang?: ILanguage) {
    const path = arenaPath
    if (!existsSync(path)) writeFileSync(path, '[]')

    const arenas = JSON.parse(readFileSync(path).toString()) as types.tdm.Arena[]

    if (arenas.filter(this.isArenaConfig).length !== arenas.length) {
      throw new Error(
        lang ?
          lang.get(Lang["error.arena.invalid_format"]) :
          'Invalid arenas format'
        )
    }

    this._arenas = arenas.map(arena => {
      return {
        [types.tdm.Team.attackers]: [],
        [types.tdm.Team.defenders]: [],
        [types.tdm.Team.spectators]: [],
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

  private static isArenaConfig(a: any): a is types.tdm.Arena {
    return typeof a?.id !== 'undefined' &&
      Array.isArray(a?.area) &&
      Array.isArray(a?.[types.tdm.Team.attackers]) &&
      Array.isArray(a?.[types.tdm.Team.defenders])
  }
}