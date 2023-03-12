import { event, eventable, logClient } from "../../league-core/client";
import { Events } from "../../league-core/src/types";
import { HudConfig } from "../../league-core/src/types/ui";
import Damage from "./hud/Damage";
import RoundStart from "./hud/RoundStart";
import RoundService from './RoundService'
import Zone from "./Zone";

@eventable
export default class HudService {
    private roundStart?: RoundStart
    private damage?: Damage

    constructor(
        readonly roundService: RoundService,
        readonly config: HudConfig,
    ) {}

    @logClient
    @event(Events["tdm.round.prepare"])
    drawRoundStart(id: number) {
        if (this.roundStart) {
            this.roundStart.destroy()
        }

        const arena = this.roundService.getArenaById(id)

        if (arena) {
            const zone = new Zone(arena)
            this.roundStart = new RoundStart(this.config.roundStart)
            this.roundStart.draw(arena.code, zone.center)
        }

        return arena
    }

    @event([Events["tdm.round.start"], Events["tdm.round.end"]]) // todo add check in decorator to server_only events
    stopDrawRoundStart() {
        if (this.roundStart) {
            this.roundStart.destroy()
        }

        this.roundStart = undefined
    }

    @logClient
    @event(Events["tdm.player.damage"])
    playerDamage(recieved: number, source: number, weapon: string, damage: number, alive: boolean) {
        try {
            const recievedPlayer = mp.players.atRemoteId(recieved)
            const sourcePlayer = mp.players.atRemoteId(source)

            if (
                !mp.players.exists(sourcePlayer) ||
                !mp.players.exists(recievedPlayer)
            ) {
                return false
            }
    
            if (this.damage) {
                this.damage.destroy()
            }
    
            const vectorSource = sourcePlayer.position
            const vectorTarget = recievedPlayer.position
    
            this.damage = new Damage(this.config.damage, {
                in: mp.players.local.remoteId === recieved,
                weapon,
                damage,
                distance: +(mp.game.system.vdist(
                    vectorSource.x, vectorSource.y, vectorSource.z,
                    vectorTarget.x, vectorTarget.y, vectorTarget.z,
                )).toFixed(2),
            })

            this.damage.draw()
        } catch (err) {
            mp.console.logError(err.stack)
        }
    }
}