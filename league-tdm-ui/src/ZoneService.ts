import { event, eventable, logClient } from "../../league-core/client"
import { tdm } from "../../league-core/src/types"
import PlayerService from "./PlayerService"
import { IRoute, Route } from "./Route"
import Zone from "./Zone"

@eventable
export default class ZoneService {
    static delayInspect = 100

    private enabled: boolean = false
    private delay: number = Date.now()
    private rollbackVector?: Vector3
    private zone?: Zone
    private route?: IRoute

    constructor(readonly playerService: PlayerService) {}

    @logClient
    enable(arena: tdm.Arena) {
        this.zone = new Zone(arena)
        this.route = new Route()

        this.enabled = true

        if (this.route) {
            this.route.clear()
            this.route.start()
        }

    }

    @logClient
    disable() {
        this.enabled = false

        if (this.route) {
            this.route.clear()
        }

        this.zone = undefined
        this.route = undefined
    }

    @event('render')
    inspectZone() {
        if (!this.enabled || !this.zone) {
            return
        }

        const vector = this.playerService.getPosition()

        this.outOfZone(vector) ?
            this.rollback() :
            this.commit(vector)

        if (this.zone && this.route) {
            for (const [x, y] of this.zone.area) {
                this.route.addPoint(x, y)
            }

            this.route.setRender(true)
        }
    }

    private outOfZone(vector: Vector3) {
        return !this.zone || !this.zone.in(vector.x, vector.y)
    }

    private rollback() {
        const delay = Date.now() - this.delay
        
        if (
            delay >= ZoneService.delayInspect &&
            this.rollbackVector
        ) {
            this.delay = Date.now()
            this.playerService.setPosition(this.rollbackVector)
        }
    }

    private commit(vector: Vector3) {
        if (!this.zone) {
            return
        }

        if (!this.zone.in(vector.x, vector.y)) {
            return
        }

        this.rollbackVector = vector
    }
}