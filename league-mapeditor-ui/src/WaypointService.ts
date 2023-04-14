import { console, route, command, commandable, eventable, event } from '../../league-core/client'
import { sleep } from '../../league-core/src/helpers'
import { Events } from '../../league-core/src/types'
import Fly from './Fly'

@eventable
@commandable
export default class WaypointService {
  static userMark: number = 162
  static hudColor: number = 9
  static thickness: number = 5
  static cmd = 'medit'

  private route: route.IRoute
  private poly: Record<number, {dot: Array2d, expired?: boolean}> = {}
  private enable: boolean = false
  private interval: number = 0

  constructor(readonly fly: Fly) {
    this.route = new route.Route()
  }

  @event("playerCreateWaypoint")
  playerCreateWaypoint(vec: Vector3) {
    const array = [vec.x, vec.y, vec.z]
    mp.events.callRemote(Events['tdm.mapeditor.save'], JSON.stringify(array))
  }
  
  @command('start', { group: WaypointService.cmd})
  start() {
    this.toggle(true)
  }

  @command('stop', { group: WaypointService.cmd})
  stop(err?: Error) {
    this.toggle(false)

    if (err instanceof Error) {
      console.error(err.stack)
    }
  }

  @command('save', { group: WaypointService.cmd })
  save() {
    mp.events.callRemote(Events['tdm.mapeditor.save'], JSON.stringify(Object.values(this.poly).map(poly => poly.dot)))
  }

  @command('reset', { group: WaypointService.cmd})
  async clearCmd() {
    this.toggle(false)

    await sleep(.5)

    this.toggle(true)
  }

  @command('fly', { group: WaypointService.cmd })
  flyCmd(description: string, toggle?: string) {
    this.fly.toggle(Boolean(toggle))
  }

  toggle(enable: boolean) {
    clearInterval(this.interval)
    this.enable = enable
    this.clear()

    if (this.enable) {
      this.interval = setInterval(() => this.render(), 0)
    }
  }

  render() {
    try {
      this.userBlipDetect()

      const values = Object.values(this.poly)

      if (!values.length) {
        return
      }
  
      for (const {dot} of values) {
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
    this.expirePolyMarks()
    this.route.clear()
    this.route.start(WaypointService.hudColor)
  }

  // todo 162 can have only 10 blips
  private userBlipDetect() {
    const aliveMarks = this.getUserMarks()

    this.refreshPolyMarks(aliveMarks)

    for (const mark of aliveMarks) {
      const coords = mp.game.ui.getBlipInfoIdCoord(mark)

      if (!coords) {
        continue
      }

      const [x, y] = [
        Number(coords.x.toFixed(4)),
        Number(coords.y.toFixed(4))
      ]

      const {
        dot: [polyX, polyY] = [],
        expired = false,
      } = this.poly[mark] || {}

      if (expired) {
        continue
      }

      if (polyX !== x || polyY !== y) {
        this.addPoint(mark, [x, y])
      }
    }
  }

  private getUserMarks() {
    const total = mp.game.ui.getNumberOfActiveBlips()
    const marks: number[] = []

    let index = 0

    while (index++ < total) {
      const mark = mp.game.ui.getNextBlipInfoId(WaypointService.userMark) >> 0

      if (!mp.game.ui.doesBlipExist(mark)) {
        continue
      }

      marks.push(mark)
    }

    return marks
  }

  private refreshPolyMarks(aliveMarks: number[]) {
    if (!aliveMarks.length) {
      return
    }

    this.poly = aliveMarks.reduce((acc, current) => {
      acc[current] = { ...this.poly[current] }

      return acc
    }, {})
  }

  private expirePolyMarks() {
    const aliveMarks = this.getUserMarks()

    this.poly = aliveMarks.reduce((acc, current) => {
      acc[current] = { ...this.poly[current], expired: true }
      return acc
    }, {})
  }

  private addPoint(mark: number, dot: Array2d) {
    this.poly[mark] = { ...this.poly[mark], dot }

    this.route.clear()
    this.route.start(WaypointService.hudColor)
  }
}