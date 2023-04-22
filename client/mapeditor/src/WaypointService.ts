import { console, route, command, commandable } from '../../../core/client'
import { sleep } from '../../../core/src/helpers'
import { Events } from '../../../core/src/types'
import Fly from './Fly'

@commandable
export default class WaypointService {
  static userMark: number = 162
  static hudColor: number = 9
  static thickness: number = 2
  static cmd = 'medit'
  static vkSpace = 0x20
  static vkDelete = 0x2E

  private route: route.IRoute
  private enable: boolean = false
  private interval: number = 0
  private poly: Array2d[] = []
  private drawPoly: Record<string, Array2d> = {}
  private binded: boolean = false

  constructor(readonly fly: Fly) {
    this.route = new route.Route()
    this.commit = this.commit.bind(this)
    this.rollback = this.rollback.bind(this)
  }
  
  @command('start', { group: WaypointService.cmd })
  async start() {
    if (this.enable) {
      this.toggle(false)
      await sleep(.5)
    }

    this.toggle(true)
  }

  @command('stop', { group: WaypointService.cmd })
  stop(err?: Error) {
    this.toggle(false)

    if (err instanceof Error) {
      console.error(err.stack)
    }
  }

  @command('save', { group: WaypointService.cmd })
  save() {
    mp.events.callRemote(Events['tdm.mapeditor.save'], JSON.stringify(this.poly))
  }

  @command('savepos', { group: WaypointService.cmd })
  savePos() {
    const {x, y, z} = mp.players.local.position

    mp.events.callRemote(Events['tdm.mapeditor.save'], JSON.stringify([[x, y, z]]))
  }

  @command('reset', { group: WaypointService.cmd})
  async reset() {
    this.toggle(false)

    await sleep(.5)

    this.toggle(true)
  }

  @command('back', { group: WaypointService.cmd })
  private rollback() {
    this.poly = this.poly.slice(0, -1)
    this.refreshRoute()
  }

  @command('fly', { group: WaypointService.cmd })
  flyCmd(_: string, toggle?: string) {
    this.fly.toggle(Boolean(toggle))
  }

  private toggle(enable: boolean) {
    clearInterval(this.interval)
    this.enable = enable
    this.clear()
    this.bindKeys()

    if (this.enable) {
      this.interval = setInterval(() => this.render(), 0)
    }
  }

  private bindKeys() {
    if (this.binded) {
      mp.keys.unbind(WaypointService.vkSpace, true, this.commit)
      mp.keys.unbind(WaypointService.vkDelete, true, this.rollback)
      this.binded = false
    }

    if (this.enable) {
      mp.keys.bind(WaypointService.vkSpace, true, this.commit)
      mp.keys.bind(WaypointService.vkDelete, true, this.rollback)
      this.binded = true
    }
  }

  private render() {
    try {
      this.fillDrawPoly()

      const values = [
        ...this.poly,
        ...Object.values(this.drawPoly),
      ].filter(Boolean)

      if (!values.length) {
        return
      }
  
      for (const dot of values) {
        if (dot?.length !== 2) {
          continue
        }

        this.route.addPoint(...dot)
      }
  
      this.route.setRender(true, WaypointService.thickness, WaypointService.thickness)
    } catch (err) {
      this.stop(err)
    }
  }

  private clear() {
    this.poly = []
    this.drawPoly = {}

    this.refreshRoute()
  }

  private fillDrawPoly() {
    const mark = this.getUserMark()

    if (!mark || !mp.game.ui.doesBlipExist(mark)) {
      return
    }

    const coords = mp.game.ui.getBlipInfoIdCoord(mark)

    if (!coords) {
      return
    }

    const [x, y] = [
      Number(coords.x.toFixed(4)),
      Number(coords.y.toFixed(4))
    ]

    if (!this.drawPoly[mark]) {
      this.drawPoly = Object.keys(this.drawPoly).reduce((acc, current) => {
        if (this.drawPoly[current]) {
          acc = { ...this.drawPoly[current] }
        }
  
        return acc
      }, {})
    }

    const [polyX, polyY] = this.drawPoly[mark] || []
    
    if (polyX !== x && polyY !== y) {
      this.drawPoly[mark] = [x, y]

      if (!this.poly.length) {
        this.poly = [[x, y]]
      }

      this.refreshRoute()
    }
  }

  private getUserMark(): number | undefined {
    return mp.game.ui.getFirstBlipInfoId(WaypointService.userMark)
  }

  private commit() {
    const [[x, y] = []] = Object.values(this.drawPoly).slice(-1)

    if (!x || !y) {
      return
    }

    const existPoly = this.findByDot([x, y])

    if (existPoly) {
      return
    }

    this.poly.push([x, y])
    this.refreshRoute()
  }

  private findByDot([x, y]: Array2d) {
    return this.poly.find(([polyX, polyY]) => (
      x === polyX && y === polyY
    ))
  }

  private refreshRoute() {
    this.route.clear()
    this.route.start(WaypointService.hudColor)
  }
}