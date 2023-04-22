import { event, eventable, console, route } from "../../../core/client"
import { tdm } from "../../../core/src/types"
import { Entity, RoundState } from "../../../core/src/types/tdm"
import DummyService from "./DummyService"
import PlayerService from "./PlayerService"
import Zone from "./Zone"

@eventable
export default class ZoneService {
    static delayInspect = 100

    private enabled: boolean = false
    private delay: number = Date.now()
    private rollbackVector?: Vector3
    private zone?: Zone
    private route?: route.IRoute

    constructor(
        readonly playerService: PlayerService,
        readonly dummyService: DummyService,
    ) {}

    enable(arena: tdm.Arena) {
        this.zone = new Zone(arena)
        this.route = new route.Route()

        this.enabled = true

        if (this.route) {
            this.route.clear()
            this.route.start()
        }

    }

    disable(err?: Error) {
        this.enabled = false

        if (this.route) {
            this.route.clear()
        }

        this.zone = undefined
        this.route = undefined

        if (err) console.error(err)
    }

    @event('render')
    inspectZone() {
        try {
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

            if (this.dummyService.get(Entity.ROUND, 'state') === RoundState.paused) {
                mp.game.controls.disableAllControlActions(2)
            }
        } catch (err) {
            this.disable(err)
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